/**
 * Server-side proxy for Nominatim address autocomplete.
 * Proxying is required because:
 *  - Nominatim blocks or rate-limits requests without a proper User-Agent
 *  - Running server-side avoids CORS and browser-level blocking
 *  - We can add caching headers to reduce repeated calls
 *
 * Usage: GET /api/address-search?q=<query>&limit=5&countrycodes=sa
 */

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  const limit = url.searchParams.get('limit') ?? '6';
  const countrycodes = url.searchParams.get('countrycodes') ?? 'sa';

  if (q.length < 2) {
    return json([]);
  }

  const nominatimUrl =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(q)}` +
    `&format=json` +
    `&limit=${limit}` +
    `&countrycodes=${countrycodes}` +
    `&addressdetails=1`;

  try {
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent':
          'FormeHaus/1.0 (https://formehaus.me; orders@formehaus.me)',
        'Accept-Language': 'en',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return json([], {status: 200});
    }

    const data = await res.json();
    return json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch {
    return json([]);
  }
}
