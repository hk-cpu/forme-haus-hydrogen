import {json, redirect, type MetaArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useNavigation, Link} from '@remix-run/react';
import {useState} from 'react';

export const meta = () => {
  return [{title: 'Activate Account — Formé Haus'}];
};

export async function action({context, request, params}: ActionFunctionArgs) {
  const {storefront, session} = context;
  const formData = await request.formData();
  const password = String(formData.get('password'));
  const {id, activationToken} = params;

  if (!password || !id || !activationToken) {
    return json({error: 'Missing fields.', success: false}, {status: 400});
  }

  try {
    const data = await storefront.mutate(CUSTOMER_ACTIVATE_MUTATION, {
      variables: {
        id: `gid://shopify/Customer/${id}`,
        input: {
          password,
          activationToken,
        },
      },
    });

    if (data.customerActivate?.customerUserErrors?.length) {
      return json({error: data.customerActivate.customerUserErrors[0].message, success: false}, {status: 400});
    }

    // Automatically log the customer in using the token generated after activation
    const accessToken = data.customerActivate?.customerAccessToken;
    if (accessToken) {
      session.set('customerAccessToken', accessToken);
      return redirect('/account', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }

    return json({success: true, error: null});
  } catch (error: any) {
    return json({error: error.message || 'Something went wrong. Please try again.', success: false}, {status: 500});
  }
}

// Eye icon SVGs
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Activate() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#F9F5F0] flex flex-col items-center justify-center text-[#2C2419]">
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[420px] mx-auto px-6 py-16">
        {/* Logo */}
        <a href="/" className="group">
          <img
            src="/brand/logo-icon-only.webp"
            alt="Formé Haus"
            className="w-24 h-auto object-contain opacity-85 transition-opacity duration-700 group-hover:opacity-100"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </a>

        <div className="text-center space-y-2">
          <h1
            className="font-serif text-3xl md:text-4xl text-[#2C2419]"
            style={{letterSpacing: '0.02em'}}
          >
            Activate Account
          </h1>
          <p className="text-[11px] tracking-[0.25em] font-sans text-[#8B8076] uppercase">
            Start Your Journey
          </p>
        </div>

        {/* Form Card */}
        <Form
          method="post"
          className="w-full space-y-6 bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl border border-brand-text/8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        >
          {actionData?.error && (
            <div className="p-3.5 text-[12px] text-[#8B3A3A] bg-[#FDF2F2] border border-[#E8C4C4] rounded-lg text-center tracking-wide">
              {actionData.error}
            </div>
          )}

          {actionData?.success ? (
            <div className="space-y-6">
              <div className="p-3.5 text-[12px] text-[#2C2419] bg-[#a87441]/10 border border-[#a87441]/20 rounded-lg text-center tracking-wide leading-relaxed">
                Account activated successfully.
              </div>
              <Link
                to="/account"
                className="block w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg font-medium text-center"
              >
                Go to Account
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] uppercase tracking-[0.2em] text-[#8B8076] mb-2 font-medium"
                >
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="Create a strong password"
                    className="w-full bg-cream border border-brand-text/12 py-3.5 pl-4 pr-12 text-[#2C2419] placeholder-[#AA9B8F]/60 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/30 transition-all duration-300 text-[13px] tracking-wide rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B8076] hover:text-[#a87441] transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? 'Activating...' : 'Activate Account'}
                </button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

const CUSTOMER_ACTIVATE_MUTATION = `#graphql
  mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
      customer {
        id
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
