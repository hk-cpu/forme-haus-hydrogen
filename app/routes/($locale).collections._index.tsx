import {redirect} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export const loader = async ({params}: LoaderFunctionArgs) => {
  const locale = params.locale ? `/${params.locale}` : '';
  return redirect(`${locale}/`, {status: 301});
};
