/**
 * Forme Haus — Sync bento editorial copy into Shopify
 * ───────────────────────────────────────────────────
 * Copies the four editorial tiles' English and Arabic strings out of
 * `app/lib/translations.ts` and writes them onto the matching `bento_item`
 * metaobject entries.
 *
 * Why this exists: the loader now prefers each entry's Admin value over the
 * translation files. The entries were seeded with different (shorter) English
 * copy than the site actually renders, so deploying that change without this
 * sync would silently alter live English text. Running this first makes the
 * deploy a visual no-op while leaving every string editable in Admin.
 *
 * The strings are parsed out of translations.ts rather than retyped here, so
 * there is no opportunity to mistranscribe the Arabic.
 *
 * Usage:
 *   node scripts/sync-bento-copy.mjs --dry-run   # print, write nothing
 *   node scripts/sync-bento-copy.mjs             # write
 *
 * Requires SHOPIFY_ADMIN_API_TOKEN and PUBLIC_STORE_DOMAIN (read from .env
 * if present), with the write_metaobjects scope.
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

const DRY_RUN = process.argv.includes('--dry-run');
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
const API_VERSION = '2024-10';

if (!DRY_RUN && (!TOKEN || !DOMAIN)) {
  console.error(
    '❌  Missing required environment variables:\n' +
      '   SHOPIFY_ADMIN_API_TOKEN=shpat_...\n' +
      '   PUBLIC_STORE_DOMAIN=your-shop.myshopify.com\n\n' +
      '   (or run with --dry-run to preview without credentials)',
  );
  process.exit(1);
}

/**
 * Which translation keys back which metaobject entry. Handles match the
 * `bento_item` entries already in the store.
 */
const TILES = [
  {handle: 'modern-essentials', key: 'editorial.modernEssentials'},
  {handle: 'carry-it-your-way', key: 'editorial.carry'},
  {handle: 'sun-ready', key: 'editorial.sun'},
  {handle: 'new-arrivals', key: 'editorial.new'},
];

/** Escapes every regex metacharacter so a key is matched literally. */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Extract the canonical strings from translations.ts ─────────────────────
function loadTranslations() {
  const src = readFileSync(
    resolve(process.cwd(), 'app/lib/translations.ts'),
    'utf8',
  );

  const enStart = src.indexOf('\n  EN: {');
  const arStart = src.indexOf('\n  AR: {');
  if (enStart === -1 || arStart === -1 || arStart < enStart) {
    throw new Error(
      'Could not locate the EN and AR blocks in app/lib/translations.ts — ' +
        'its structure changed, so this script needs updating.',
    );
  }

  const sections = {
    EN: src.slice(enStart, arStart),
    AR: src.slice(arStart),
  };

  /** Reads one key out of one language block. Values may wrap onto the next line. */
  function read(lang, key) {
    const pattern = new RegExp(
      `'${escapeRegExp(key)}':\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`,
    );
    const match = sections[lang].match(pattern);
    if (!match) throw new Error(`Missing ${lang} translation for "${key}"`);
    return match[1];
  }

  return TILES.map(({handle, key}) => ({
    handle,
    fields: {
      title_en: read('EN', `${key}.title`),
      subtitle_en: read('EN', `${key}.subtitle`),
      title_ar: read('AR', `${key}.title`),
      subtitle_ar: read('AR', `${key}.subtitle`),
    },
  }));
}

// ── Admin API ───────────────────────────────────────────────────────────────
async function adminQuery(query, variables = {}) {
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
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

const UPDATE_MUTATION = `
  mutation SyncBentoEntry($id: ID!, $fields: [MetaobjectFieldInput!]!) {
    metaobjectUpdate(id: $id, metaobject: {fields: $fields}) {
      metaobject { handle }
      userErrors { field message code }
    }
  }
`;

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const tiles = loadTranslations();

  console.log(
    `\n📝  Bento copy sync${DRY_RUN ? ' (dry run — no writes)' : ''}`,
  );
  console.log(`    Source: app/lib/translations.ts\n`);

  for (const tile of tiles) {
    console.log(`  ${tile.handle}`);
    for (const [key, value] of Object.entries(tile.fields)) {
      console.log(`    ${key.padEnd(13)} ${value}`);
    }
    console.log('');
  }

  if (DRY_RUN) {
    console.log(
      'Dry run — nothing written. Re-run without --dry-run to apply.',
    );
    return;
  }

  // Resolve handles to IDs rather than hardcoding them.
  const data = await adminQuery(`{
    metaobjects(type: "bento_item", first: 50) {
      nodes { id handle }
    }
  }`);
  const idByHandle = new Map(
    data.metaobjects.nodes.map((n) => [n.handle, n.id]),
  );

  let written = 0;
  for (const tile of tiles) {
    const id = idByHandle.get(tile.handle);
    if (!id) {
      console.warn(
        `  ⚠️  No bento_item entry with handle "${tile.handle}" — skipped`,
      );
      continue;
    }

    const result = await adminQuery(UPDATE_MUTATION, {
      id,
      fields: Object.entries(tile.fields).map(([key, value]) => ({key, value})),
    });

    const errors = result.metaobjectUpdate.userErrors;
    if (errors?.length) {
      throw new Error(
        `${tile.handle}: ${errors.map((e) => e.message).join('; ')}`,
      );
    }
    console.log(`  ✅  Synced ${tile.handle}`);
    written++;
  }

  console.log(`\n✨  ${written} of ${tiles.length} entries synced.`);
  console.log(
    '    English and Arabic now match what the site renders today, and both\n' +
      '    are editable under Content → Metaobjects → Bento Item.',
  );
}

main().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
