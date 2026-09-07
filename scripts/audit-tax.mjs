#!/usr/bin/env node
/**
 * VAT audit for the Formé Haus store.
 *
 * Written after order No.1026 went out with 0.00 SR VAT on a 922.00 SR line.
 * One product variant had "Charge tax on this product" unticked, so Shopify
 * recorded the full amount as net revenue. Under ZATCA the VAT was still due,
 * which left 120.26 SR owed and an invoice that was not a valid tax invoice.
 *
 * Nothing in the storefront computes VAT — Shopify does, from per-variant and
 * per-customer flags that any admin can toggle by accident. This script is the
 * check that nobody has.
 *
 * It fails (exit 1) when it finds anything that would suppress VAT:
 *   - a product variant with taxable = false
 *   - a customer with taxExempt = true
 *   - prices no longer configured as tax-inclusive
 *
 * It warns (exit 0) on things that need a human judgement rather than a fix,
 * such as shipping not being taxed.
 *
 * Usage:
 *   SHOPIFY_ADMIN_API_TOKEN=shpat_... SHOPIFY_STORE_DOMAIN=xxx.myshopify.com \
 *     node scripts/audit-tax.mjs
 *
 * Reads the same .env the app uses if the variables are not already set.
 */

import {readFileSync, existsSync} from 'node:fs';

const API_VERSION = '2025-01';

function loadEnv() {
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]])
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || process.env.PUBLIC_STORE_DOMAIN;

if (!TOKEN || !DOMAIN) {
  console.error(
    'Missing credentials. Set SHOPIFY_ADMIN_API_TOKEN and SHOPIFY_STORE_DOMAIN\n' +
      '(or PUBLIC_STORE_DOMAIN), or put them in .env.',
  );
  process.exit(2);
}

async function gql(query, variables = {}) {
  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  if (!res.ok) throw new Error(`Admin API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data;
}

async function paginate(query, pick) {
  const out = [];
  let after = null;
  do {
    const data = await gql(query, {after});
    const conn = pick(data);
    out.push(...conn.nodes);
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
  return out;
}

const PRODUCTS = `
  query($after: String) {
    products(first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { title status variants(first: 100) { nodes { id title price taxable } } }
    }
  }`;

const CUSTOMERS = `
  query($after: String) {
    customers(first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { id taxExempt taxExemptions }
    }
  }`;

const SHOP = `{ shop { name taxesIncluded taxShipping currencyCode } }`;

const failures = [];
const warnings = [];

const shop = (await gql(SHOP)).shop;
if (!shop.taxesIncluded) {
  failures.push(
    'Shop prices are no longer tax-inclusive (taxesIncluded = false). Every ' +
      'displayed price now excludes VAT, which changes what customers are charged.',
  );
}
if (!shop.taxShipping) {
  warnings.push(
    'Shipping is not taxed (taxShipping = false). Harmless while delivery is ' +
      'free, but any paid shipping goes out with no VAT. Settings > Taxes and ' +
      'duties > "Charge tax on shipping rates". Not settable via the API.',
  );
}

const products = await paginate(PRODUCTS, (d) => d.products);
const variants = products.flatMap((p) =>
  p.variants.nodes.map((v) => ({product: p.title, status: p.status, ...v})),
);
const untaxed = variants.filter((v) => !v.taxable);
for (const v of untaxed) {
  failures.push(
    `Product variant does not charge VAT: "${v.product}" / ${v.title} ` +
      `(${v.price} ${shop.currencyCode}) — untick is in the variant's Pricing section.`,
  );
}

const customers = await paginate(CUSTOMERS, (d) => d.customers);
const exempt = customers.filter((c) => c.taxExempt);
for (const c of exempt) {
  failures.push(
    `Customer is tax-exempt and will pay no VAT on anything: ${c.id} ` +
      `${
        c.taxExemptions?.length
          ? `(${c.taxExemptions.join(', ')})`
          : '(no exemption type recorded)'
      }`,
  );
}

console.log(`Store            ${shop.name}`);
console.log(
  `Prices           ${shop.taxesIncluded ? 'VAT-inclusive' : 'VAT-EXCLUSIVE'}`,
);
console.log(`Shipping taxed   ${shop.taxShipping ? 'yes' : 'no'}`);
console.log(`Products         ${products.length}`);
console.log(
  `Variants         ${variants.length}  (${
    variants.length - untaxed.length
  } charge VAT)`,
);
console.log(
  `Customers        ${customers.length}  (${exempt.length} tax-exempt)`,
);
console.log('');

for (const w of warnings) console.log(`WARN   ${w}`);
if (warnings.length) console.log('');

if (failures.length === 0) {
  console.log('PASS — every product charges VAT and no customer is exempt.');
  process.exit(0);
}

for (const f of failures) console.error(`FAIL   ${f}`);
console.error(
  `\n${failures.length} problem(s) found. VAT is being suppressed somewhere.`,
);
process.exit(1);
