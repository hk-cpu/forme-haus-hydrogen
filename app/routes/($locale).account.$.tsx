import {redirect} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context, params}: LoaderFunctionArgs) {
  const {session} = context;
  const customerAccessToken = session.get('customerAccessToken');

  const locale = params.locale;

  if (!customerAccessToken) {
    return redirect(locale ? `/${locale}/account/login` : '/account/login');
  }

  return redirect(locale ? `/${locale}/account` : '/account');
}
