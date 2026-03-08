import {redirect} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params}: LoaderFunctionArgs) {
  const locale = params.locale;
  return redirect(locale ? `/${locale}/account/login` : '/account/login');
}
