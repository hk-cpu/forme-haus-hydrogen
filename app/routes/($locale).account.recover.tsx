import {type MetaArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useNavigation, Link} from '@remix-run/react';

export const meta = () => {
  return [{title: 'Recover Password — Formé Haus'}];
};

export async function action({context, request}: ActionFunctionArgs) {
  const {storefront} = context;
  const formData = await request.formData();
  const email = String(formData.get('email'));

  if (!email) {
    return {error: 'Please provide an email.'};
  }

  try {
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return {success: true};
  } catch (error: any) {
    return {error: error.message || 'Something went wrong. Please try again.'};
  }
}

export default function Recover() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="relative min-h-screen w-full bg-[#F9F5F0] flex flex-col items-center justify-center text-[#2C2419]">
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[420px] mx-auto px-6 py-16">
        {/* Logo */}
        <a href="/" className="group">
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus"
            className="w-24 h-auto object-contain opacity-85 transition-opacity duration-700 group-hover:opacity-100"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={40}
            height={40}
          />
        </a>

        <div className="text-center space-y-2">
          <h1
            className="font-serif text-3xl md:text-4xl text-[#2C2419]"
            style={{letterSpacing: '0.02em'}}
          >
            Recover Access
          </h1>
          <p className="text-[11px] tracking-[0.25em] font-sans text-[#8B8076] uppercase">
            We&rsquo;ll send you a reset link
          </p>
        </div>

        {/* Form Card */}
        <Form
          method="post"
          className="w-full space-y-6 bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl border border-[#4A3C31]/8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        >
          {actionData?.error && (
            <div role="alert" aria-live="assertive" className="p-3.5 text-[12px] text-[#8B3A3A] bg-[#FDF2F2] border border-[#E8C4C4] rounded-lg text-center tracking-wide">
              {actionData.error}
            </div>
          )}

          {actionData?.success && (
            <div className="p-3.5 text-[12px] text-[#2C2419] bg-[#a87441]/10 border border-[#a87441]/20 rounded-lg text-center tracking-wide leading-relaxed">
              Check your inbox — a reset link has been sent to your email
              address.
            </div>
          )}

          {!actionData?.success && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-[10px] uppercase tracking-[0.2em] text-[#8B8076] mb-2 font-medium"
                >
                  Email Address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#F9F5F0] border border-[#4A3C31]/12 py-3.5 px-4 text-[#2C2419] placeholder-[#AA9B8F]/60 focus:outline-none focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/30 transition-all duration-300 text-[13px] tracking-wide rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <Link
              to="/account/login"
              className="text-[10px] uppercase tracking-[0.15em] text-[#8B8076] hover:text-[#a87441] transition-colors duration-300 font-semibold"
            >
              ← Back to Sign In
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
