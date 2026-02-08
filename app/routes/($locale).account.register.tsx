import { type MetaArgs, type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';

export const meta: MetaArgs = () => {
    return [{ title: 'Register' }];
};

export async function action({ context, request }: ActionFunctionArgs) {
    const { storefront } = context;
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (!email || !password) {
        return { error: 'Please provide both email and password.', success: undefined };
    }

    try {
        const data = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
            variables: {
                input: { email, password },
            },
        });

        if (data.customerCreate?.customerUserErrors?.length) {
            return { error: data.customerCreate.customerUserErrors[0].message, success: undefined };
        }

        return { error: undefined, success: true };
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.', success: undefined };
    }
}

export default function Register() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="flex justify-center my-24 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-[#4A3C31]">
                        Create an Account
                    </h2>
                </div>
                <Form method="post" className="mt-8 space-y-6">
                    {actionData?.error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <span className="font-medium">Error!</span> {actionData.error}
                        </div>
                    )}
                    {actionData?.success && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            <span className="font-medium">Success!</span> Account created. Please check your email to verify.
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#8B8076]/30 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#a87441] focus:border-[#a87441] focus:z-10 sm:text-sm bg-transparent"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#8B8076]/30 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#a87441] focus:border-[#a87441] focus:z-10 sm:text-sm bg-transparent"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4A3C31] hover:bg-[#5C5046] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a87441] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Sign up'}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerAccountCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
