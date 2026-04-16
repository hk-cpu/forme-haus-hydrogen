/**
 * Update Louve Collection product variant prices via Shopify Admin GraphQL API.
 *
 * Usage:
 *   SHOPIFY_STORE_DOMAIN=xxx.myshopify.com SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx node scripts/update-prices.js
 */

const PRICES = [
  {sku: 'MS-C-C-IP-17PRX', price: '170.00'},
  {sku: 'MS-C-C-IP-17PR', price: '170.00'},
  {sku: 'MS-C-TPU-CFN-17PX', price: '210.00'},
  {sku: 'MS-C-TPU-CFN-17PR', price: '210.00'},
  {sku: 'MS-C-TPU-DP-17PX', price: '210.00'},
  {sku: 'MS-C-TPU-DP-17PR', price: '210.00'},
  {sku: 'C-TPU-PP-17PX', price: '170.00'},
  {sku: 'C-TPU-PP-17PR', price: '170.00'},
  {sku: 'E-MS-HPNK-17PX', price: '182.00'},
  {sku: 'E-MS-HPNK-17PR', price: '182.00'},
  {sku: 'E-MS-BL-17PX', price: '182.00'},
  {sku: 'E-MS-BL-16PR', price: '182.00'},
  {sku: 'C-C-IP-17PRX', price: '170.00'},
  {sku: 'C-C-IP-17PR', price: '170.00'},
  {sku: 'S-DAC-BIS-G', price: '96.00'},
  {sku: 'S-DAC-MYS-G', price: '96.00'},
  {sku: 'S-DAC-SAN-G', price: '96.00'},
  {sku: 'S-CH-PRL-L', price: '127.00'},
  {sku: 'S-CH-GAIA-L', price: '127.00'},
  {sku: 'S-CH-AVA-L', price: '127.00'},
  {sku: 'S-CH-BODI-S', price: '115.00'},
  {sku: 'A-KNT-LNG-BLU-G', price: '121.00'},
  {sku: 'S-KNT-LNH-PNK-S', price: '121.00'},
  {sku: 'S-CRNY-BLK-G', price: '121.00'},
  {sku: 'S-CRNY-BL-G', price: '121.00'},
  {sku: 'S-CH-BLUSH-S-G', price: '136.00'},
  {sku: 'S-CH-ABB-OFFW-S', price: '136.00'},
  {sku: 'S-CH-RAIN-G-S', price: '136.00'},
  {sku: 'S-CH-DAR-PUR-S', price: '136.00'},
  {sku: 'S-CH-DAR-GR-S', price: '136.00'},
];

const STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.PUBLIC_STORE_DOMAIN ||
  'f0c5au-jn.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error(
    'Error: Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN environment variables.',
  );
  process.exit(1);
}

const ADMIN_URL = `https://${STORE_DOMAIN}/admin/api/2024-10/graphql.json`;

async function shopifyAdmin(query, variables = {}) {
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function findVariantBySku(sku) {
  const query = `
    query ($query: String!) {
      productVariants(first: 1, query: $query) {
        edges {
          node {
            id
            sku
            price
            product { title }
          }
        }
      }
    }
  `;
  const {data, errors} = await shopifyAdmin(query, {query: `sku:${sku}`});
  if (errors) throw new Error(JSON.stringify(errors));
  return data.productVariants.edges[0]?.node || null;
}

async function updateVariantPrice(variantId, price) {
  const query = `
    mutation ($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant { id sku price }
        userErrors { field message }
      }
    }
  `;
  const {data, errors} = await shopifyAdmin(query, {
    input: {id: variantId, price},
  });
  if (errors) throw new Error(JSON.stringify(errors));
  if (data.productVariantUpdate.userErrors.length > 0) {
    throw new Error(
      data.productVariantUpdate.userErrors.map((e) => e.message).join(', '),
    );
  }
  return data.productVariantUpdate.productVariant;
}

async function main() {
  console.log(
    `Updating ${PRICES.length} variant prices on ${STORE_DOMAIN}...\n`,
  );

  let success = 0;
  let failed = 0;

  for (const {sku, price} of PRICES) {
    try {
      const variant = await findVariantBySku(sku);
      if (!variant) {
        console.log(`[SKIP] ${sku} — variant not found`);
        failed++;
        continue;
      }

      if (variant.price === price) {
        console.log(
          `[OK]   ${sku} — already SAR ${price} (${variant.product.title})`,
        );
        success++;
        continue;
      }

      const updated = await updateVariantPrice(variant.id, price);
      console.log(
        `[DONE] ${sku} — ${variant.price} → SAR ${updated.price} (${variant.product.title})`,
      );
      success++;
    } catch (err) {
      console.log(`[FAIL] ${sku} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nComplete: ${success} succeeded, ${failed} failed.`);
}

main();
