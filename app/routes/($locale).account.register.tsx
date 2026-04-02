import {type MetaArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useNavigation, Link} from '@remix-run/react';
import {useState} from 'react';
import {useTranslation} from '~/hooks/useTranslation';

export const meta = () => {
  return [{title: 'Create Account — Formé Haus'}];
};

export async function action({context, request}: ActionFunctionArgs) {
  const {storefront} = context;
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  if (!email || !password) {
    return {
      error: 'Please provide both email and password.',
      success: undefined,
    };
  }

  try {
    const data = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password},
      },
    });

    if (data.customerCreate?.customerUserErrors?.length) {
      return {
        error: data.customerCreate.customerUserErrors[0].message,
        success: undefined,
      };
    }

    return {error: undefined, success: true};
  } catch (error: any) {
    return {
      error: error.message || 'Something went wrong. Please try again.',
      success: undefined,
    };
  }
}

// Eye icon SVGs
const EyeOpen = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Register() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showPassword, setShowPassword] = useState(false);
  const {t, isRTL} = useTranslation();

  return (
    <div className="relative min-h-screen w-full bg-[#F9F5F0] flex flex-col items-center justify-center text-[#2C2419]" dir={isRTL ? 'rtl' : 'ltr'}>
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
            width={40}
            height={40}
          />
        </a>

        <div className="text-center space-y-2">
          <h1
            className="font-serif text-3xl md:text-4xl text-[#2C2419]"
            style={{letterSpacing: '0.02em'}}
          >
            {t('auth.joinFormeHaus')}
          </h1>
          <p className="text-[11px] tracking-[0.25em] font-sans text-[#8B8076] uppercase">
            {t('auth.beginJourney')}
          </p>
        </div>

        {/* Form Card */}
        {actionData?.success ? (
          <div className="w-full bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl border border-[#4A3C31]/8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#a87441]/15 flex items-center justify-center mx-auto">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a87441"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-[#2C2419]">
                {t('auth.accountCreated')}
              </h2>
              <p className="text-[13px] text-[#8B8076] leading-relaxed">
                {t('auth.checkEmailVerify')}
              </p>
            </div>
            <Link
              to="/account/login"
              className="inline-block w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg font-medium"
            >
              {t('auth.signIn')}
            </Link>
          </div>
        ) : (
          <Form
            method="post"
            className="w-full space-y-6 bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl border border-[#4A3C31]/8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          >
            {actionData?.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 text-[12px] text-[#8B3A3A] bg-[#FDF2F2] border border-[#E8C4C4] rounded-lg text-center tracking-wide"
              >
                {actionData.error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-xs uppercase tracking-[0.2em] text-[#8B8076] mb-2 font-medium"
                >
                  {t('auth.emailAddress')}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#F9F5F0] border border-[#4A3C31]/12 py-3.5 px-4 text-[#2C2419] placeholder-[#AA9B8F]/60 focus:outline-none focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/30 transition-all duration-300 text-sm tracking-wide rounded-lg"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-[0.2em] text-[#8B8076] mb-2 font-medium"
                >
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="Create a strong password"
                    className="w-full bg-[#F9F5F0] border border-[#4A3C31]/12 py-3.5 pl-4 pr-12 text-[#2C2419] placeholder-[#AA9B8F]/60 focus:outline-none focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/30 transition-all duration-300 text-sm tracking-wide rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B8076] hover:text-[#a87441] transition-colors duration-200"
                    aria-label={
                      showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                    }
                  >
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-xs transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? t('auth.creatingAccount') : t('auth.createAccount')}
              </button>

              <div className="flex flex-col items-center gap-3 pt-2">
                <Link
                  to="/account/login"
                  className="text-xs uppercase tracking-[0.15em] text-[#8B8076] hover:text-[#a87441] transition-colors duration-300 font-semibold"
                >
                  {t('auth.alreadyHaveAccount')}
                </Link>
              </div>
            </div>
          </Form>
        )}
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
