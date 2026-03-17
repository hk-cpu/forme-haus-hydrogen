import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
  useRouteError,
  isRouteErrorResponse,
  Link as RemixLink,
  useLocation,
} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {defer, redirect} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {flattenConnection, Image, Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

import {Modal} from '~/components/Modal';
import {Link} from '~/components/Link';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {customer} = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken.accessToken,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  if (!customer) {
    throw redirect('/account/login');
  }

  return defer(
    {customer},
    {headers: {'Cache-Control': CACHE_NONE}},
  );
}

// ─── GraphQL ──────────────────────────────────────────────────────────────────
const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      createdAt
      defaultAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        country
        province
        city
        zip
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

// ─── Route ────────────────────────────────────────────────────────────────────
export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  const renderOutletInModal = matches.some((match) => {
    const handle = match?.handle as {renderInModal?: boolean};
    return handle?.renderInModal;
  });

  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Dashboard customer={data.customer} />
        </>
      );
    }
    return <Outlet context={{customer: data.customer}} />;
  }

  return <Dashboard customer={data.customer} />;
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'orders' | 'profile' | 'addresses';

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({customer}: {customer: any}) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const {isRTL} = useTranslation();
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);
  const displayName = customer.firstName
    ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
    : customer.email;

  const memberSince = new Date(customer.createdAt).toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
  });

  const totalSpent = orders.reduce(
    (sum: number, o: any) => sum + parseFloat(o.currentTotalPrice?.amount || '0'),
    0,
  );

  const tabs: {id: Tab; label: string; labelAr: string; icon: React.ReactNode}[] = [
    {
      id: 'overview',
      label: 'Overview',
      labelAr: 'نظرة عامة',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      labelAr: 'الطلبات',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
          <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      labelAr: 'الملف الشخصي',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      labelAr: 'العناوين',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#121212] text-[#F0EAE6]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1A1A1A] via-[#1E1814] to-[#1A1A1A] border-b border-[#a87441]/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#a87441]/8 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar + Name */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#a87441] to-[#8B5E3C] flex items-center justify-center shadow-lg shadow-[#a87441]/20 flex-shrink-0">
                <span className="font-serif text-2xl md:text-3xl text-white">
                  {(customer.firstName?.[0] || customer.email[0]).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B8076] mb-1">
                  {isRTL ? 'أهلاً بك' : 'Welcome back'}
                </p>
                <h1 className="font-serif text-2xl md:text-3xl text-[#F0EAE6]">
                  {displayName}
                </h1>
                <p className="text-xs text-[#8B8076] mt-1">
                  {isRTL ? `عضو منذ ${memberSince}` : `Member since ${memberSince}`}
                </p>
              </div>
            </div>

            {/* Sign Out */}
            <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
              <button
                type="submit"
                className="text-[#8B8076] hover:text-[#F0EAE6] text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isRTL ? 'تسجيل الخروج' : 'Sign out'}
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[#F0EAE6]/5 bg-[#161616] sticky top-[var(--navbar-height,64px)] z-10">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-[11px] uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-[#a87441] text-[#a87441]'
                    : 'border-transparent text-[#8B8076] hover:text-[#F0EAE6]'
                }`}
              >
                {tab.icon}
                {isRTL ? tab.labelAr : tab.label}
                {tab.id === 'orders' && orders.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#a87441]/20 text-[#a87441] text-[9px]">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                customer={customer}
                orders={orders}
                totalSpent={totalSpent}
                onNavigate={setActiveTab}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} />
            )}
            {activeTab === 'profile' && (
              <ProfileTab customer={customer} />
            )}
            {activeTab === 'addresses' && (
              <AddressesTab addresses={addresses} customer={customer} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  customer,
  orders,
  totalSpent,
  onNavigate,
}: {
  customer: any;
  orders: any[];
  totalSpent: number;
  onNavigate: (tab: Tab) => void;
}) {
  const {isRTL} = useTranslation();
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="grid gap-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label={isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
          value={String(orders.length)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label={isRTL ? 'إجمالي الإنفاق' : 'Total Spent'}
          value={`${totalSpent.toFixed(0)} SAR`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label={isRTL ? 'العناوين المحفوظة' : 'Saved Addresses'}
          value={String(customer.addresses?.edges?.length || 0)}
          className="col-span-2 md:col-span-1"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-[#F0EAE6]">
            {isRTL ? 'آخر الطلبات' : 'Recent Orders'}
          </h2>
          {orders.length > 3 && (
            <button
              onClick={() => onNavigate('orders')}
              className="text-[#a87441] text-xs uppercase tracking-wider hover:text-[#D4AF87] transition-colors"
            >
              {isRTL ? 'عرض الكل' : 'View all'}
            </button>
          )}
        </div>

        {recentOrders.length ? (
          <div className="grid gap-3">
            {recentOrders.map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bag"
            message={isRTL ? 'لا توجد طلبات حتى الآن' : "You haven't placed any orders yet."}
            action={
              <Link
                to="/"
                className="inline-block mt-4 px-6 py-2.5 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#8B5E3C] transition-colors"
              >
                {isRTL ? 'تسوق الآن' : 'Start Shopping'}
              </Link>
            }
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {label: isRTL ? 'تعديل الملف' : 'Edit Profile', to: '/account/edit', icon: '✏️'},
          {label: isRTL ? 'إضافة عنوان' : 'Add Address', to: '/account/address/add', icon: '📍'},
          {label: isRTL ? 'التواصل معنا' : 'Contact Us', to: '/contact', icon: '💬'},
          {label: isRTL ? 'سياسة الإرجاع' : 'Returns', to: '/policies/refund-policy', icon: '↩️'},
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-2 p-4 bg-[#1A1A1A] border border-[#F0EAE6]/5 rounded-xl hover:border-[#a87441]/30 hover:bg-[#1E1814] transition-all text-center group"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-[10px] uppercase tracking-wider text-[#8B8076] group-hover:text-[#F0EAE6] transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({orders}: {orders: any[]}) {
  const {isRTL} = useTranslation();

  if (!orders.length) {
    return (
      <EmptyState
        icon="bag"
        message={isRTL ? 'لا توجد طلبات حتى الآن' : "You haven't placed any orders yet."}
        action={
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2.5 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#8B5E3C] transition-colors"
          >
            {isRTL ? 'تسوق الآن' : 'Start Shopping'}
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-3">
      <h2 className="font-serif text-xl text-[#F0EAE6] mb-2">
        {isRTL ? 'سجل الطلبات' : 'Order History'}
        <span className="text-sm font-sans font-normal text-[#8B8076] ml-3">
          ({orders.length})
        </span>
      </h2>
      {orders.map((order: any) => (
        <OrderRow key={order.id} order={order} detailed />
      ))}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({customer}: {customer: any}) {
  const {isRTL} = useTranslation();
  const {firstName, lastName, email, phone} = customer;

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-[#F0EAE6]">
          {isRTL ? 'الملف الشخصي' : 'Profile'}
        </h2>
        <Link
          to="/account/edit"
          prefetch="intent"
          className="flex items-center gap-1.5 text-[#a87441] hover:text-[#D4AF87] text-xs uppercase tracking-wider transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isRTL ? 'تعديل' : 'Edit'}
        </Link>
      </div>

      <div className="bg-[#1A1A1A] border border-[#F0EAE6]/5 rounded-xl overflow-hidden">
        {[
          {label: isRTL ? 'الاسم' : 'Name', value: firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : '—'},
          {label: isRTL ? 'البريد الإلكتروني' : 'Email', value: email || '—'},
          {label: isRTL ? 'رقم الهاتف' : 'Phone', value: phone || '—'},
        ].map((field, i) => (
          <div
            key={field.label}
            className={`flex items-start justify-between px-6 py-4 ${
              i < 2 ? 'border-b border-[#F0EAE6]/5' : ''
            }`}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] pt-0.5 min-w-[80px]">
              {field.label}
            </span>
            <span className="text-sm text-[#F0EAE6] text-right flex-1 ml-4">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────
function AddressesTab({addresses, customer}: {addresses: any[]; customer: any}) {
  const {isRTL} = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-[#F0EAE6]">
          {isRTL ? 'العناوين المحفوظة' : 'Saved Addresses'}
        </h2>
        <Link
          to="/account/address/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a87441] text-white text-[11px] uppercase tracking-wider rounded-sm hover:bg-[#8B5E3C] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          </svg>
          {isRTL ? 'إضافة عنوان' : 'Add Address'}
        </Link>
      </div>

      {!addresses.length ? (
        <EmptyState
          icon="location"
          message={isRTL ? 'لم تحفظ أي عنوان بعد' : "You haven't saved any addresses yet."}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {customer.defaultAddress && (
            <AddressCard address={customer.defaultAddress} isDefault />
          )}
          {addresses
            .filter((a) => a.id !== customer.defaultAddress?.id)
            .map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  className = '',
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#1A1A1A] border border-[#F0EAE6]/5 rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-2 text-[#8B8076] mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="font-serif text-2xl text-[#F0EAE6]">{value}</p>
    </div>
  );
}

function OrderRow({order, detailed = false}: {order: any; detailed?: boolean}) {
  const legacyOrderId = order.id.split('/').pop();
  const url = `/account/orders/${legacyOrderId}`;
  const lineItems = flattenConnection(order.lineItems);
  const firstImage = lineItems[0]?.variant?.image;

  const statusColor = (status: string) => {
    if (status === 'FULFILLED' || status === 'PAID') return 'text-[#a87441] bg-[#a87441]/10 border-[#a87441]/20';
    if (status === 'REFUNDED' || status === 'CANCELLED') return 'text-red-400 bg-red-400/10 border-red-400/20';
    return 'text-[#8B8076] bg-[#8B8076]/10 border-[#8B8076]/20';
  };

  return (
    <motion.div
      layout
      className="flex items-center gap-4 p-4 bg-[#1A1A1A] border border-[#F0EAE6]/5 rounded-xl hover:border-[#a87441]/20 transition-all group"
    >
      {/* Product thumbnail */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-[#242424] flex-shrink-0">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText ?? ''}
            width={64}
            height={64}
            className="w-full h-full object-contain p-1.5"
            sizes="64px"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 text-[#8B8076]/30">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[#F0EAE6] text-sm font-medium truncate">
              {lineItems.length > 1
                ? `${lineItems[0].title} +${lineItems.length - 1}`
                : lineItems[0]?.title}
            </p>
            <p className="text-[#8B8076] text-[11px] mt-0.5">
              Order #{order.orderNumber} · {new Date(order.processedAt).toLocaleDateString('en-SA')}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[#a87441] text-sm font-medium">
              {parseFloat(order.currentTotalPrice?.amount || '0').toFixed(0)}{' '}
              {order.currentTotalPrice?.currencyCode}
            </p>
          </div>
        </div>

        {detailed && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full border ${statusColor(order.financialStatus)}`}>
              {order.financialStatus}
            </span>
            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full border ${statusColor(order.fulfillmentStatus)}`}>
              {order.fulfillmentStatus}
            </span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <Link
        to={url}
        prefetch="intent"
        className="text-[#8B8076] group-hover:text-[#a87441] transition-colors flex-shrink-0"
        aria-label={`View order #${order.orderNumber}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.div>
  );
}

function AddressCard({address, isDefault = false}: {address: any; isDefault?: boolean}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#F0EAE6]/5 rounded-xl p-5 flex flex-col hover:border-[#a87441]/20 transition-all">
      {isDefault && (
        <span className="self-start mb-3 px-2.5 py-1 text-[9px] uppercase tracking-widest font-medium rounded-full bg-[#a87441]/15 text-[#a87441] border border-[#a87441]/20">
          Default
        </span>
      )}
      <div className="flex-1 text-sm text-[#F0EAE6]/80 leading-relaxed space-y-0.5">
        {(address.firstName || address.lastName) && (
          <p className="font-medium text-[#F0EAE6] text-xs uppercase tracking-wide mb-2">
            {`${address.firstName || ''} ${address.lastName || ''}`.trim()}
          </p>
        )}
        {address.formatted?.map((line: string) => (
          <p key={line} className="text-xs text-[#8B8076]">{line}</p>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[#F0EAE6]/5">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          prefetch="intent"
          className="text-[#a87441] hover:text-[#D4AF87] text-[10px] uppercase tracking-widest transition-colors"
        >
          Edit
        </Link>
        <Form action={`/account/address/${encodeURIComponent(address.id)}`} method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-[#8B8076] hover:text-red-400 text-[10px] uppercase tracking-widest transition-colors">
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  action,
}: {
  icon: 'bag' | 'location';
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#F0EAE6]/5 flex items-center justify-center mb-4">
        {icon === 'bag' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7 text-[#8B8076]/40">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7 text-[#8B8076]/40">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )}
      </div>
      <p className="text-[#8B8076] text-sm">{message}</p>
      {action}
    </div>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center min-h-[50vh] bg-[#121212]">
      <h1 className="font-serif text-3xl md:text-4xl text-[#F0EAE6] mb-4">
        {is404 ? 'Page Not Found' : 'Account Error'}
      </h1>
      <p className="text-[#8B8076] mb-8 max-w-md text-sm">
        {is404
          ? "We couldn't find the page you're looking for."
          : 'There was an error loading your account. Please try signing in again.'}
      </p>
      <RemixLink
        to="/account/login"
        className="inline-block bg-[#a87441] text-white text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#8B5E34] transition-colors"
      >
        Sign In
      </RemixLink>
    </div>
  );
}
