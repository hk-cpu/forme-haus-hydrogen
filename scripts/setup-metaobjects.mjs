/**
 * Forme Haus — Shopify Metaobject & Metafield Setup
 * ─────────────────────────────────────────────────
 * Creates all metaobject definitions and shop/collection metafield definitions
 * needed for backend-editable content on the storefront.
 *
 * Usage:
 *   SHOPIFY_ADMIN_API_TOKEN=shpat_xxx PUBLIC_STORE_DOMAIN=formehaus.myshopify.com \
 *   node scripts/setup-metaobjects.mjs
 *
 * Or with a .env file present (reads it automatically):
 *   node scripts/setup-metaobjects.mjs
 */

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

// ── Load .env if present ────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env not present — rely on environment variables
}

const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
const API_VERSION = '2024-10';

if (!TOKEN || !DOMAIN) {
  console.error(
    '❌  Missing required environment variables:\n' +
      '   SHOPIFY_ADMIN_API_TOKEN=shpat_...\n' +
      '   PUBLIC_STORE_DOMAIN=your-shop.myshopify.com',
  );
  process.exit(1);
}

const endpoint = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function adminQuery(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

// ── Helper: create metaobject definition ────────────────────────────────────
async function createMetaobjectDefinition(type, name, displayNameKey, fields) {
  const existing = await adminQuery(`{
    metaobjectDefinitionByType(type: "${type}") { id type }
  }`);
  if (existing?.metaobjectDefinitionByType?.id) {
    console.log(`  ⏩  ${type} already exists — skipping`);
    return existing.metaobjectDefinitionByType;
  }

  const data = await adminQuery(
    `mutation MetaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition { id type name }
        userErrors { field message }
      }
    }`,
    {
      definition: {
        type,
        name,
        displayNameKey,
        fieldDefinitions: fields,
      },
    },
  );

  const result = data.metaobjectDefinitionCreate;
  if (result.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join('; '));
  }
  console.log(
    `  ✅  Created metaobject definition: ${type} (${result.metaobjectDefinition.id})`,
  );
  return result.metaobjectDefinition;
}

// ── Helper: create metafield definition ────────────────────────────────────
async function createMetafieldDefinition(namespace, key, name, ownerType, fieldType) {
  // Check if it already exists
  const existing = await adminQuery(`{
    metafieldDefinitions(ownerType: ${ownerType}, namespace: "${namespace}", first: 50) {
      nodes { id key namespace }
    }
  }`);
  const found = existing?.metafieldDefinitions?.nodes?.find(
    (n) => n.namespace === namespace && n.key === key,
  );
  if (found) {
    console.log(`  ⏩  metafield ${ownerType}::${namespace}.${key} already exists — skipping`);
    return found;
  }

  const data = await adminQuery(
    `mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id namespace key }
        userErrors { field message }
      }
    }`,
    {
      definition: {
        namespace,
        key,
        name,
        ownerType,
        type: fieldType,
      },
    },
  );

  const result = data.metafieldDefinitionCreate;
  if (result.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join('; '));
  }
  console.log(
    `  ✅  Created metafield: ${ownerType}::${namespace}.${key} (${result.createdDefinition.id})`,
  );
  return result.createdDefinition;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🏗️  Forme Haus — Shopify Setup`);
  console.log(`   Store: ${DOMAIN}`);
  console.log(`   API:   ${API_VERSION}\n`);

  // ── 1. category_card metaobject definition ──────────────────────────────
  console.log('📦  Metaobject: category_card (homepage category tiles)');
  await createMetaobjectDefinition(
    'category_card',
    'Category Card',
    'title_en',
    [
      {key: 'title_en', name: 'Title (English)', type: {name: 'single_line_text_field'}, required: true},
      {key: 'title_ar', name: 'Title (Arabic)', type: {name: 'single_line_text_field'}, required: false},
      {key: 'image', name: 'Image', type: {name: 'file_reference'}, required: true},
      {key: 'url', name: 'Link URL', type: {name: 'url'}, required: true},
      {key: 'sort_order', name: 'Sort Order', type: {name: 'number_integer'}, required: false},
    ],
  );

  // ── 2. bento_item metaobject definition ────────────────────────────────
  console.log('\n📦  Metaobject: bento_item (homepage editorial bento grid)');
  await createMetaobjectDefinition(
    'bento_item',
    'Bento Item',
    'title_en',
    [
      {key: 'title_en', name: 'Title (English)', type: {name: 'single_line_text_field'}, required: true},
      {key: 'title_ar', name: 'Title (Arabic)', type: {name: 'single_line_text_field'}, required: false},
      {key: 'subtitle_en', name: 'Subtitle (English)', type: {name: 'single_line_text_field'}, required: false},
      {key: 'subtitle_ar', name: 'Subtitle (Arabic)', type: {name: 'single_line_text_field'}, required: false},
      {key: 'image', name: 'Image', type: {name: 'file_reference'}, required: true},
      {key: 'alt', name: 'Image Alt Text', type: {name: 'single_line_text_field'}, required: false},
      {key: 'url', name: 'Link URL', type: {name: 'url'}, required: false},
    ],
  );

  // ── 3. Hero CTA shop metafields ─────────────────────────────────────────
  console.log('\n🏪  Shop metafields: hero CTA button text');
  await createMetafieldDefinition('hero', 'cta_en', 'Hero CTA (English)', 'SHOP', 'single_line_text_field');
  await createMetafieldDefinition('hero', 'cta_ar', 'Hero CTA (Arabic)', 'SHOP', 'single_line_text_field');

  // ── 4. Footer shop metafields ───────────────────────────────────────────
  console.log('\n🏪  Shop metafields: footer social links & legal');
  await createMetafieldDefinition('footer', 'instagram_url', 'Instagram URL', 'SHOP', 'url');
  await createMetafieldDefinition('footer', 'snapchat_url', 'Snapchat URL', 'SHOP', 'url');
  await createMetafieldDefinition('footer', 'tiktok_url', 'TikTok URL', 'SHOP', 'url');
  await createMetafieldDefinition('footer', 'whatsapp_number', 'WhatsApp Number (with country code, no +)', 'SHOP', 'single_line_text_field');
  await createMetafieldDefinition('footer', 'cr_no', 'Commercial Registration No.', 'SHOP', 'single_line_text_field');
  await createMetafieldDefinition('footer', 'vat_no', 'VAT Registration No.', 'SHOP', 'single_line_text_field');

  // ── 5. Collection hero image metafield ─────────────────────────────────
  console.log('\n🗂️  Collection metafield: custom hero image');
  await createMetafieldDefinition('custom', 'hero_image', 'Hero Image', 'COLLECTION', 'file_reference');

  console.log('\n✨  Setup complete!\n');
  console.log('Next steps in Shopify Admin:');
  console.log('  1. Content → Metaobjects → Category Card → Add entries');
  console.log('     • title_en, title_ar, image, url, sort_order for each category tile');
  console.log('  2. Content → Metaobjects → Bento Item → Add entries');
  console.log('     • title_en, image, url for each bento grid item');
  console.log('  3. Settings → Custom data → Shop → hero.cta_en / hero.cta_ar');
  console.log('     • e.g. "Explore Collection" / "استكشف المجموعة"');
  console.log('  4. Settings → Custom data → Shop → footer.instagram_url etc.');
  console.log('     • Fill in your social media URLs and legal registration numbers');
  console.log('  5. Catalog → Collections → [any collection] → Custom data → custom.hero_image');
  console.log('     • Upload a hero banner image for that collection page');
}

main().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
