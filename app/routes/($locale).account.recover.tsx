import { type MetaArgs, type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';

export const meta: MetaArgs = () => {
    return [{ title: 'Recover Password' }];
};

export async function action({ context, request }: ActionFunctionArgs) {
    const { storefront } = context;
    const formData = await request.formData();
    const email = String(formData.get('email'));

    if (!email) {
        return { error: 'Please provide an email.' };
    }

    try {
        await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
            variables: { email },
        });

        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.' };
    }
}

export default function Recover() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="flex justify-center my-24 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-[#4A3C31]">
                        Recover Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive password reset instructions.
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
                            <span className="font-medium">Success!</span> Check your email for reset instructions.
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#8B8076]/30 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#a87441] focus:border-[#a87441] focus:z-10 sm:text-sm bg-transparent"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4A3C31] hover:bg-[#5C5046] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a87441] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Recovery Email'}
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <Link to="/account/login" className="font-medium text-[#4A3C31] hover:text-[#5C5046]">
                            Back to Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
