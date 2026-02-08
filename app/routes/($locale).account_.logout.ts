import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
  return redirect('/');
}

export async function action({ context }: ActionFunctionArgs) {
  const { session } = context;
  session.unset('customerAccessToken');

  return redirect('/', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export const doLogout = async ({ session }: { session: any }) => {
  session.unset('customerAccessToken');
  return redirect('/', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
};
