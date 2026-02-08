import { type MetaArgs, type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { Form, useActionData, useNavigation } from '@remix-run/react';

export const meta: MetaArgs = () => {
    return [{ title: 'Reset Password' }];
};

export async function action({ context, request, params }: ActionFunctionArgs) {
    const { storefront } = context;
    const formData = await request.formData();
    const password = String(formData.get('password'));
    const { id, resetToken } = params;

    if (!password || !id || !resetToken) {
        return { error: 'Missing fields.' };
    }

    try {
        const data = await storefront.mutate(CUSTOMER_RESET_MUTATION, {
            variables: {
                id: `gid://shopify/Customer/${id}`,
                input: {
                    password,
                    resetToken
                },
            },
        });

        if (data.customerReset?.customerUserErrors?.length) {
            return { error: data.customerReset.customerUserErrors[0].message };
        }

        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.' };
    }
}

export default function Reset() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="flex justify-center my-24 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-[#4A3C31]">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>
                <Form method="post" className="mt-8 space-y-6">
                    {actionData?.error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <span className="font-medium">Error!</span> {actionData.error}
                        </div>
                    )}
                    {actionData?.success && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            <span className="font-medium">Success!</span> Password reset. You may now login.
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#8B8076]/30 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#a87441] focus:border-[#a87441] focus:z-10 sm:text-sm bg-transparent"
                                placeholder="New Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4A3C31] hover:bg-[#5C5046] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a87441] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

const CUSTOMER_RESET_MUTATION = `#graphql
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
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
