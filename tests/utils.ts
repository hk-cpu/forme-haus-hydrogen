/**
 * Formats a number as SAR. Example: 1800 => SAR 1,800.00
 */
export function formatPrice(
  price: string | number,
  currency = 'SAR',
  locale = 'en-SA',
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  return formatter.format(Number(price));
}

/**
 * Removes symbols and decimals from a price and converts to number.
 */
export function normalizePrice(price: string | null) {
  if (!price || !/^[A-Za-z\s\d.,]+$/.test(price)) {
    throw new Error('Price was not found');
  }

  return Number(
    price
      .replace(/[^\d.,]/g, '')
      .trim()
      .replace(/[.,](\d\d)$/, '-$1')
      .replace(/[.,]/g, '')
      .replace('-', '.'),
  );
}
