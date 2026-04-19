import {json, redirect} from '@remix-run/server-runtime';
import {type ActionFunction} from '@shopify/remix-oxygen';
import {
  useActionData,
  Form,
  useOutletContext,
  useNavigation,
} from '@remix-run/react';
import invariant from 'tiny-invariant';

import {Button} from '~/components/Button';
import {Text} from '~/components/Text';
import {getInputStyleClasses} from '~/lib/utils';

import {doLogout} from './($locale).account_.logout';

export interface AccountOutletContext {
  customer: any;
}

export interface ActionData {
  success?: boolean;
  formError?: string;
  fieldErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    newPassword2?: string;
  };
}

const formDataHas = (formData: FormData, key: string) => {
  if (!formData.has(key)) return false;

  const value = formData.get(key);
  return typeof value === 'string' && value.length > 0;
};

export const handle = {
  renderInModal: true,
};

export const action: ActionFunction = async ({request, context, params}) => {
  const formData = await request.formData();
  const {session, storefront} = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    throw await doLogout(context);
  }

  try {
    const customer: Record<string, string> = {};

    formDataHas(formData, 'firstName') &&
      (customer.firstName = formData.get('firstName') as string);
    formDataHas(formData, 'lastName') &&
      (customer.lastName = formData.get('lastName') as string);

    const {customerUpdate}: any = await storefront.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customerAccessToken: customerAccessToken.accessToken,
          customer,
        },
      },
    );

    invariant(
      !customerUpdate?.customerUserErrors?.length,
      customerUpdate?.customerUserErrors?.[0]?.message,
    );

    return redirect(params?.locale ? `/${params.locale}/account` : '/account');
  } catch (error: any) {
    return json(
      {formError: error?.message},
      {
        status: 400,
      },
    );
  }
};

const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

/**
 * Since this component is nested in `accounts/`, it is rendered in a modal via `<Outlet>` in `account.tsx`.
 *
 * This allows us to:
 * - preserve URL state (`/accounts/edit` when the modal is open)
 * - co-locate the edit action with the edit form (rather than grouped in account.tsx)
 * - use the `useOutletContext` hook to access the customer data from the parent route (no additional data loading)
 * - return a simple `redirect()` from this action to close the modal :mindblown: (no useState/useEffect)
 * - use the presence of outlet data (in `account.tsx`) to open/close the modal (no useState)
 */
export default function AccountDetailsEdit() {
  const actionData = useActionData<ActionData>();
  const {customer} = useOutletContext<AccountOutletContext>();
  const {state} = useNavigation();

  return (
    <>
      <Text className="mt-4 mb-6 font-serif text-warm" as="h3" size="lead">
        Update your profile
      </Text>
      <Form method="post">
        {actionData?.formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-center justify-center mb-6 bg-red-100 rounded"
          >
            <p className="m-4 text-sm text-red-900">{actionData.formError}</p>
          </div>
        )}
        <div className="mt-3">
          <input
            className="appearance-none rounded-lg bg-[#2A231C] border border-warm/10 w-full py-3 px-4 text-warm placeholder-taupe/50 focus:border-bronze focus:ring-1 focus:ring-bronze outline-none transition-all"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
            defaultValue={customer.firstName ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="appearance-none rounded-lg bg-[#2A231C] border border-warm/10 w-full py-3 px-4 text-warm placeholder-taupe/50 focus:border-bronze focus:ring-1 focus:ring-bronze outline-none transition-all"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
            defaultValue={customer.lastName ?? ''}
          />
        </div>
        <div className="mt-6">
          <Button
            className="w-full py-3 rounded-lg bg-[#a87441] hover:bg-[#8B5E3C] text-white text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 mt-4"
            type="submit"
            disabled={state !== 'idle'}
          >
            {state !== 'idle' ? 'Saving' : 'Save'}
          </Button>
        </div>
        <div className="mb-4">
          <Button to=".." className="w-full block py-3 rounded-lg border border-warm/10 hover:border-warm/30 text-warm text-center text-[11px] uppercase tracking-wider transition-colors mt-3">
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
}
