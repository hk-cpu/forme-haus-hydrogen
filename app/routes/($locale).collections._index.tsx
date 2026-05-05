import {redirect} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

/**
 * /collections → /collections/all (all products)
 * Handles locale prefix too: /ar/collections → /ar/collections/all
 */
export const loader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  // Strip trailing slash then append /all
  const target = url.pathname.replace(/\/$/, '') + '/all';
  return redirect(target, {status: 301});
};

// Route renders nothing — loader always redirects
export default function CollectionsIndex() {
  return null;
}
