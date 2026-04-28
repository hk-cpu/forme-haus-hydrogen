import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useFetcher, useLoaderData, Link} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {useState, useCallback, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

import {saveCheckoutData, getCheckoutData} from '~/lib/checkout.server';
import {buildLocalePath, getPathLocalePrefix} from '~/lib/utils';

// ── Loader ──────────────────────────────────────────────────────────────────
export async function loader({context}: LoaderFunctionArgs) {
  const {cart, session} = context;
  const cartResult = await cart.get();
  if (!cartResult || (cartResult.totalQuantity ?? 0) === 0)
    throw redirect('/cart');

  const lines = flattenConnection(cartResult.lines).map((line: any) => ({
    id: line.id,
    title: line.merchandise?.product?.title ?? 'Product',
    variantTitle: line.merchandise?.title ?? '',
    quantity: line.quantity,
    price: line.cost?.totalAmount?.amount ?? '0',
    currency: line.cost?.totalAmount?.currencyCode ?? 'SAR',
    image: line.merchandise?.image?.url ?? null,
  }));

  const prefill = getCheckoutData(session);

  return json({
    lines,
    total: cartResult.cost.totalAmount.amount,
    subtotal:
      cartResult.cost.subtotalAmount?.amount ??
      cartResult.cost.totalAmount.amount,
    currency: cartResult.cost.totalAmount.currencyCode ?? 'SAR',
    cartId: cartResult.id ?? '',
    prefillContact: prefill?.contact ?? null,
    prefillAddress: prefill?.address ?? null,
  });
}

// ── Action ───────────────────────────────────────────────────────────────────
export async function action({request, context}: ActionFunctionArgs) {
  const {cart, session, env} = context;
  const fd = await request.formData();

  const firstName = (fd.get('firstName') as string | null) ?? '';
  const lastName = (fd.get('lastName') as string | null) ?? '';
  const email = (fd.get('email') as string | null) ?? '';
  const phone = (fd.get('phone') as string | null) ?? '';
  const line1 = (fd.get('line1') as string | null) ?? '';
  const line2 = (fd.get('line2') as string | null) ?? '';
  const city = (fd.get('city') as string | null) ?? '';
  const country = (fd.get('country') as string | null) ?? 'Saudi Arabia';
  const zip = (fd.get('zip') as string | null) ?? '';

  if (!firstName || !lastName || !email || !phone || !line1 || !city) {
    return json({error: 'Please complete all required fields.'}, {status: 400});
  }

  const cartResult = await cart.get();
  if (!cartResult || (cartResult.totalQuantity ?? 0) === 0) {
    return redirect('/cart');
  }

  const total = cartResult.cost.totalAmount.amount;
  const currency = cartResult.cost.totalAmount.currencyCode ?? 'SAR';
  const cartId = cartResult.id ?? '';
  const merchantTxId = `FH-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const cartLines = flattenConnection(cartResult.lines).map((l: any) => ({
    title: l.merchandise?.product?.title ?? 'Product',
    variantTitle: l.merchandise?.title ?? null,
    quantity: l.quantity,
    price: l.cost?.totalAmount?.amount ?? '0',
    currency: l.cost?.totalAmount?.currencyCode ?? currency,
    image: l.merchandise?.image?.url ?? null,
    variantId: l.merchandise?.id ?? '',
  }));

  const reqUrl = new URL(request.url);
  const origin = reqUrl.origin;
  const locale = getPathLocalePrefix(reqUrl.pathname);
  const cbPath = buildLocalePath('/tap/callback', locale);
  const wbPath = buildLocalePath('/tap/webhook', locale);
  const rawPhone = phone
    .replace(/^\+966/, '')
    .replace(/^966/, '')
    .replace(/^0/, '');

  const tapPayload: Record<string, unknown> = {
    amount: parseFloat(total),
    currency,
    customer_initiated: true,
    threeDSecure: true,
    save_card: false,
    description: `Forme Haus Order ${merchantTxId}`,
    metadata: {merchantTxId, cartId},
    reference: {transaction: merchantTxId, order: merchantTxId},
    receipt: {email: true, sms: true},
    customer: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: {country_code: '966', number: rawPhone},
    },
    shipping: {
      address: {
        line1,
        line2: line2 || undefined,
        city,
        country_code: 'SA',
        zip: zip || undefined,
      },
    },
    source: {id: 'src_all'},
    post: {url: `${origin}${wbPath}`},
    redirect: {
      url: `${origin}${cbPath}?merchantTxId=${encodeURIComponent(
        merchantTxId,
      )}`,
    },
  };

  const secretKey = env.TAP_SECRET_KEY;
  const apiUrl = env.TAP_API_URL || 'https://api.tap.company/v2';

  if (!secretKey)
    return json({error: 'Payment gateway not configured.'}, {status: 500});

  try {
    const res = await fetch(`${apiUrl}/charges`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(tapPayload),
    });
    const data = (await res.json()) as {
      id?: string;
      transaction?: {url?: string};
      errors?: {description: string}[];
    };

    if (data.errors?.length) {
      return json(
        {error: data.errors[0]?.description ?? 'Payment initiation failed.'},
        {status: 400},
      );
    }
    if (!data.transaction?.url) {
      return json({error: 'Failed to create payment session.'}, {status: 400});
    }

    saveCheckoutData(session, {
      merchantTxId,
      cartId,
      cartLines,
      total,
      currency,
      contact: {firstName, lastName, email, phone},
      address: {
        line1,
        line2: line2 || undefined,
        city,
        country,
        countryCode: 'SA',
        zip: zip || undefined,
      },
      createdAt: Date.now(),
    });

    return json({redirectUrl: data.transaction.url, chargeId: data.id});
  } catch (err) {
    console.error('[Checkout] Tap error:', err);
    return json({error: 'Payment service unavailable.'}, {status: 503});
  }
}

// ── UI Helpers ────────────────────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 bg-surface border border-taupe/20 rounded-lg text-warm placeholder:text-taupe/40 focus:outline-none focus:border-bronze/60 transition-colors text-sm';
const labelCls =
  'block text-[10px] uppercase tracking-widest text-taupe mb-1.5';

function Field({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {label: string}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {props.required && <span className="text-bronze ml-0.5">*</span>}
      </label>
      <input id={id} name={id} className={inputCls} {...props} />
    </div>
  );
}

const KSA_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Khobar',
  'Dhahran',
  'Tabuk',
  'Abha',
  'Taif',
  'Yanbu',
  'Buraydah',
  'Najran',
  'Jizan',
  'Khamis Mushait',
  'Hail',
  'Jubail',
  'Al Kharj',
];

type NominatimHit = {
  place_id: number;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    postcode?: string;
  };
};

function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (h: NominatimHit) => void;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<NominatimHit[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.length < 3) {
      setHits([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            q,
          )}&format=json&limit=5&countrycodes=sa&addressdetails=1`,
          {headers: {'Accept-Language': 'en'}},
        );
        setHits((await r.json()) as any);
      } catch {}
      setBusy(false);
    }, 600);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div className="relative">
      <label className={labelCls} htmlFor="address-search">
        Search Address
      </label>
      <div className="relative">
        <input
          id="address-search"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Start typing your address…"
          className={inputCls + ' pr-10'}
          autoComplete="off"
        />
        {busy && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-bronze/30 border-t-bronze rounded-full animate-spin" />
        )}
      </div>
      {hits.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#1C1714] border border-taupe/20 rounded-lg shadow-2xl overflow-hidden">
          {hits.map((h) => (
            <button
              key={h.place_id}
              type="button"
              className="w-full text-left px-4 py-2.5 text-xs text-warm hover:bg-bronze/10 transition-colors border-b border-taupe/10 last:border-0"
              onClick={() => {
                onSelect(h);
                setQ(h.display_name.split(',').slice(0, 2).join(','));
                setHits([]);
              }}
            >
              {h.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const {lines, total, subtotal, currency, prefillContact, prefillAddress} =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({
    firstName: prefillContact?.firstName ?? '',
    lastName: prefillContact?.lastName ?? '',
    email: prefillContact?.email ?? '',
    phone: prefillContact?.phone ?? '',
  });
  const [addr, setAddr] = useState({
    line1: prefillAddress?.line1 ?? '',
    line2: prefillAddress?.line2 ?? '',
    city: prefillAddress?.city ?? 'Riyadh',
    zip: prefillAddress?.zip ?? '',
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Redirect to Tap on success
  useEffect(() => {
    if (fetcher.state === 'idle' && (fetcher.data as any)?.redirectUrl) {
      window.location.href = (fetcher.data as any).redirectUrl;
    }
  }, [fetcher.state, fetcher.data]);

  const handleGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            {headers: {'Accept-Language': 'en'}},
          );
          const d = (await r.json()) as {
            address?: {
              road?: string;
              suburb?: string;
              neighbourhood?: string;
              city?: string;
              town?: string;
              postcode?: string;
            };
          };
          setAddr((prev) => ({
            ...prev,
            line1:
              [d.address?.road, d.address?.suburb ?? d.address?.neighbourhood]
                .filter(Boolean)
                .join(', ') || prev.line1,
            city: d.address?.city ?? d.address?.town ?? prev.city,
            zip: d.address?.postcode ?? prev.zip,
          }));
          if (step === 2) setStep(2);
        } catch {}
        setGpsLoading(false);
      },
      () => {
        setGpsError('Location access denied.');
        setGpsLoading(false);
      },
    );
  }, [step]);

  const handleAddressSelect = useCallback((h: NominatimHit) => {
    setAddr((prev) => ({
      ...prev,
      line1:
        [h.address?.road, h.address?.suburb].filter(Boolean).join(', ') ||
        h.display_name.split(',')[0],
      city: h.address?.city ?? h.address?.town ?? prev.city,
      zip: h.address?.postcode ?? prev.zip,
    }));
  }, []);

  const formatMoney = (amount: string, curr: string) =>
    new Intl.NumberFormat('en-SA', {style: 'currency', currency: curr}).format(
      parseFloat(amount),
    );

  const actionErr = (fetcher.data as any)?.error;
  const isSubmitting = fetcher.state !== 'idle';

  const slideVariants = {
    enter: {x: 40, opacity: 0},
    center: {x: 0, opacity: 1},
    exit: {x: -40, opacity: 0},
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl text-warm mb-2">
            Secure Checkout
          </h1>
          <p className="text-taupe text-sm">
            Your order stays 100% on Forme Haus
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {['Contact', 'Shipping', 'Review'].map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center">
                <button
                  type="button"
                  onClick={() => done && setStep(n)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-widest transition-all ${
                    active
                      ? 'bg-bronze text-white'
                      : done
                      ? 'text-bronze cursor-pointer'
                      : 'text-taupe/40 cursor-default'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      active
                        ? 'bg-white text-bronze'
                        : done
                        ? 'bg-bronze text-white'
                        : 'bg-taupe/20 text-taupe'
                    }`}
                  >
                    {done ? '✓' : n}
                  </span>
                  {label}
                </button>
                {i < 2 && (
                  <div
                    className={`w-8 h-px ${
                      step > n ? 'bg-bronze' : 'bg-taupe/20'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form side */}
          <div className="bg-surface/40 border border-taupe/10 rounded-2xl p-6 md:p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* STEP 1: Contact */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{duration: 0.3}}
                >
                  <h2 className="font-serif text-xl text-warm mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Field
                      id="firstName"
                      label="First Name"
                      required
                      placeholder="Sarah"
                      value={contact.firstName}
                      onChange={(e) =>
                        setContact((c) => ({...c, firstName: e.target.value}))
                      }
                    />
                    <Field
                      id="lastName"
                      label="Last Name"
                      required
                      placeholder="Al-Harbi"
                      value={contact.lastName}
                      onChange={(e) =>
                        setContact((c) => ({...c, lastName: e.target.value}))
                      }
                    />
                  </div>
                  <div className="space-y-4 mb-8">
                    <Field
                      id="email"
                      label="Email"
                      required
                      type="email"
                      placeholder="sarah@example.com"
                      value={contact.email}
                      onChange={(e) =>
                        setContact((c) => ({...c, email: e.target.value}))
                      }
                    />
                    <div>
                      <label htmlFor="phone" className={labelCls}>
                        Phone<span className="text-bronze ml-0.5">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-surface border border-taupe/20 rounded-lg text-taupe text-sm whitespace-nowrap">
                          🇸🇦 +966
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="5X XXX XXXX"
                          className={inputCls}
                          value={contact.phone}
                          onChange={(e) =>
                            setContact((c) => ({...c, phone: e.target.value}))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={
                      !contact.firstName ||
                      !contact.lastName ||
                      !contact.email ||
                      !contact.phone
                    }
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-bronze hover:bg-bronze/90 disabled:opacity-40 text-white text-[11px] uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Continue to Shipping →
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Address */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{duration: 0.3}}
                >
                  <h2 className="font-serif text-xl text-warm mb-6">
                    Shipping Address
                  </h2>

                  {/* GPS Button */}
                  <button
                    type="button"
                    onClick={handleGPS}
                    disabled={gpsLoading}
                    className="w-full mb-5 flex items-center justify-center gap-2 py-3 border border-bronze/40 text-bronze rounded-xl text-[11px] uppercase tracking-widest hover:bg-bronze/10 transition-colors disabled:opacity-50"
                  >
                    {gpsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-bronze/30 border-t-bronze rounded-full animate-spin" />{' '}
                        Detecting location…
                      </>
                    ) : (
                      <>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
                        </svg>{' '}
                        Use my current location
                      </>
                    )}
                  </button>
                  {gpsError && (
                    <p className="text-red-400 text-xs mb-4">{gpsError}</p>
                  )}

                  <div className="space-y-4 mb-8">
                    <AddressAutocomplete onSelect={handleAddressSelect} />
                    <Field
                      id="line1"
                      label="Street Address"
                      required
                      placeholder="Building / Street"
                      value={addr.line1}
                      onChange={(e) =>
                        setAddr((a) => ({...a, line1: e.target.value}))
                      }
                    />
                    <Field
                      id="line2"
                      label="Apt / Unit (optional)"
                      placeholder="Apartment, Suite, etc."
                      value={addr.line2}
                      onChange={(e) =>
                        setAddr((a) => ({...a, line2: e.target.value}))
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className={labelCls}>
                          City<span className="text-bronze ml-0.5">*</span>
                        </label>
                        <select
                          id="city"
                          name="city"
                          value={addr.city}
                          onChange={(e) =>
                            setAddr((a) => ({...a, city: e.target.value}))
                          }
                          className={inputCls + ' cursor-pointer'}
                        >
                          {KSA_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Field
                        id="zip"
                        label="Postal Code"
                        placeholder="12345"
                        value={addr.zip}
                        onChange={(e) =>
                          setAddr((a) => ({...a, zip: e.target.value}))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 border border-taupe/20 text-taupe rounded-xl text-[11px] uppercase tracking-widest hover:bg-taupe/10 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={!addr.line1 || !addr.city}
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 bg-bronze hover:bg-bronze/90 disabled:opacity-40 text-white text-[11px] uppercase tracking-widest rounded-xl transition-colors"
                    >
                      Review Order →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{duration: 0.3}}
                >
                  <h2 className="font-serif text-xl text-warm mb-6">
                    Review & Pay
                  </h2>

                  {/* Summary boxes */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-surface rounded-xl border border-taupe/10">
                      <p className="text-[10px] uppercase tracking-widest text-taupe mb-2">
                        Contact
                      </p>
                      <p className="text-warm text-sm">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-taupe text-xs">{contact.email}</p>
                      <p className="text-taupe text-xs">{contact.phone}</p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[10px] text-bronze hover:underline mt-1"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="p-4 bg-surface rounded-xl border border-taupe/10">
                      <p className="text-[10px] uppercase tracking-widest text-taupe mb-2">
                        Shipping To
                      </p>
                      <p className="text-warm text-sm">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                      </p>
                      <p className="text-taupe text-xs">
                        {addr.city}, Saudi Arabia {addr.zip}
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[10px] text-bronze hover:underline mt-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {actionErr && (
                    <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-xs text-center">
                      {actionErr}
                    </div>
                  )}

                  {/* Pay button — submits all data */}
                  <fetcher.Form method="post">
                    <input
                      type="hidden"
                      name="firstName"
                      value={contact.firstName}
                    />
                    <input
                      type="hidden"
                      name="lastName"
                      value={contact.lastName}
                    />
                    <input type="hidden" name="email" value={contact.email} />
                    <input type="hidden" name="phone" value={contact.phone} />
                    <input type="hidden" name="line1" value={addr.line1} />
                    <input type="hidden" name="line2" value={addr.line2} />
                    <input type="hidden" name="city" value={addr.city} />
                    <input type="hidden" name="country" value="Saudi Arabia" />
                    <input type="hidden" name="countryCode" value="SA" />
                    <input type="hidden" name="zip" value={addr.zip} />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-4 border border-taupe/20 text-taupe rounded-xl text-[11px] uppercase tracking-widest hover:bg-taupe/10 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-bronze hover:bg-bronze/90 disabled:opacity-60 text-white text-[11px] uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                            Preparing payment…
                          </>
                        ) : (
                          <>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                              />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>{' '}
                            Pay {formatMoney(total, currency)}
                          </>
                        )}
                      </button>
                    </div>
                  </fetcher.Form>

                  {/* Payment badges */}
                  <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                    {['mada', 'Visa', 'Mastercard', 'Apple Pay', 'STC Pay'].map(
                      (m) => (
                        <span
                          key={m}
                          className="px-2 py-1 text-[9px] font-medium text-taupe bg-surface border border-taupe/10 rounded"
                        >
                          {m}
                        </span>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary side */}
          <div className="bg-surface/40 border border-taupe/10 rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-serif text-lg text-warm mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {lines.map((line: any) => (
                <div key={line.id} className="flex gap-3">
                  {line.image && (
                    <img
                      src={line.image}
                      alt={line.title}
                      className="w-14 h-14 object-cover rounded-lg bg-taupe/10 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-warm text-xs truncate">{line.title}</p>
                    {line.variantTitle &&
                      line.variantTitle !== 'Default Title' && (
                        <p className="text-taupe text-[10px]">
                          {line.variantTitle}
                        </p>
                      )}
                    <p className="text-taupe text-[10px]">
                      Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-warm text-xs whitespace-nowrap">
                    {formatMoney(line.price, line.currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-taupe/10 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-taupe">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-taupe">
                <span>Shipping</span>
                <span>
                  {parseFloat(subtotal) >= 250 ? (
                    <span className="text-bronze">Free</span>
                  ) : (
                    formatMoney('25', currency)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-warm font-semibold text-base pt-2 border-t border-taupe/10">
                <span>Total</span>
                <span>{formatMoney(total, currency)}</span>
              </div>
            </div>
            <p className="text-[10px] text-taupe/50 text-center mt-4">
              All orders recorded in Forme Haus admin. Secure payment via Tap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
