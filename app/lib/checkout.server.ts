/**
 * Checkout Session Helpers
 * ─────────────────────────
 * Persists checkout state (contact info, shipping address, cart snapshot)
 * across the Tap Payments redirect so the callback can create the Shopify
 * order without re-fetching the cart (which may have been cleared by then).
 */

export interface CartLineSnapshot {
  title: string;
  variantTitle?: string | null;
  quantity: number;
  price: string;
  currency: string;
  image?: string | null;
  variantId: string;
}

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  line1: string;
  line2?: string;
  city: string;
  country: string;
  countryCode: string;
  zip?: string;
}

export interface CheckoutSessionData {
  merchantTxId: string;
  cartId: string;
  cartLines: CartLineSnapshot[];
  total: string;
  currency: string;
  contact: CheckoutContact;
  address: CheckoutAddress;
  createdAt: number;
  /** Set to true once a Shopify Draft Order has been created to prevent duplicates */
  orderCreated?: boolean;
  shopifyOrderId?: string;
}

/** Session key — short to keep cookie small */
const SESSION_KEY = 'co_data';

type SessionSetter = {set: (key: string, val: string) => void};
type SessionGetter = {get: (key: string) => unknown};
type SessionUnsetter = {unset: (key: string) => void};

export function saveCheckoutData(
  session: SessionSetter,
  data: CheckoutSessionData,
): void {
  session.set(SESSION_KEY, JSON.stringify(data));
}

export function getCheckoutData(
  session: SessionGetter,
): CheckoutSessionData | null {
  const raw = session.get(SESSION_KEY);
  if (!raw || typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as CheckoutSessionData;
  } catch {
    return null;
  }
}

export function clearCheckoutData(session: SessionUnsetter): void {
  session.unset(SESSION_KEY);
}

export function markOrderCreated(
  session: SessionGetter & SessionSetter,
  shopifyOrderId: string,
): void {
  const data = getCheckoutData(session);
  if (!data) return;
  saveCheckoutData(session, {...data, orderCreated: true, shopifyOrderId});
}
