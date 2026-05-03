import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  Link,
  useSearchParams,
  useRouteLoaderData,
  useSubmit,
} from '@remix-run/react';
import {useState, useEffect, Suspense, lazy} from 'react';

import type {RootLoader} from '~/root';

const GoogleSSOButton = lazy(() =>
  import('~/components/GoogleSSO.client').then((m) => ({
    default: m.GoogleSSOButton,
  })),
);

const GhostCursorEnhanced = lazy(
  () => import('~/components/GhostCursorEnhanced.client'),
);

export async function loader({context, request}: LoaderFunctionArgs) {
  const {session} = context;

  if (await session.get('customerAccessToken')) {
    return redirect(`${context.storefront.i18n?.pathPrefix || ''}/account`);
  }

  return json({});
}

export async function action({context, request}: ActionFunctionArgs) {
  const {storefront, session} = context;
  const formData = await request.formData();
  const formId = String(formData.get('formId'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  if (formId === 'googleAuth' && !formData.get('credential')) {
    return json({error: 'Google response empty', formId}, {status: 400});
  }

  if (formId === 'googleAuth') {
    const credential = String(formData.get('credential'));
    if (!credential)
      return json({error: 'Google login failed.', formId}, {status: 400});
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
      const payload = JSON.parse(jsonPayload) as {email?: string};
      const email = payload.email;

      if (!email)
        return json(
          {error: 'Could not extract email from Google identity.', formId},
          {status: 400},
        );

      let hash = 0;
      const secretStr = email + (context.env?.SESSION_SECRET || 'secret');
      for (let i = 0; i < secretStr.length; i++) {
        hash = (Math.imul(31, hash) + secretStr.charCodeAt(i)) | 0;
      }
      const dummyPassword =
        Math.abs(hash).toString(16).padEnd(8, '0') + 'A1!xZ';

      const {customerAccessTokenCreate: loginResult}: any =
        await storefront.mutate(LOGIN_MUTATION, {
          variables: {input: {email, password: dummyPassword}},
        });

      let customerAccessToken = loginResult?.customerAccessToken;

      const loginUserErrors = loginResult?.customerUserErrors ?? [];
      const isDisabled = loginUserErrors.some(
        (e: any) => e.code === 'CUSTOMER_DISABLED',
      );
      if (isDisabled) {
        return json(
          {
            error:
              'Your account requires email activation. Please check your inbox for the activation link.',
            formId: 'login',
          },
          {status: 401},
        );
      }

      if (!customerAccessToken) {
        const {customerCreate}: any = await storefront.mutate(
          CUSTOMER_CREATE_MUTATION,
          {variables: {input: {email, password: dummyPassword}}},
        );
        const createUserErrors = customerCreate?.customerUserErrors ?? [];
        const emailTaken = createUserErrors.some(
          (e: any) => e.code === 'TAKEN',
        );

        if (emailTaken) {
          return json(
            {
              error:
                'This email is already registered. Please sign in with your email and password, or use "Forgot Password" to reset it.',
              formId: 'login',
            },
            {status: 400},
          );
        }

        if (createUserErrors.length) {
          return json(
            {
              error:
                createUserErrors[0]?.message || 'Failed to create account.',
              formId,
            },
            {status: 400},
          );
        }

        const {customerAccessTokenCreate: retryResult}: any =
          await storefront.mutate(LOGIN_MUTATION, {
            variables: {input: {email, password: dummyPassword}},
          });
        customerAccessToken = retryResult?.customerAccessToken;

        const retryErrors = retryResult?.customerUserErrors ?? [];
        const retryDisabled = retryErrors.some(
          (e: any) => e.code === 'CUSTOMER_DISABLED',
        );
        if (retryDisabled) {
          return json(
            {
              error:
                'Account created! Please check your email for an activation link before signing in.',
              formId: 'login',
            },
            {status: 401},
          );
        }
        if (!customerAccessToken?.accessToken && retryErrors.length) {
          return json(
            {
              error:
                retryErrors[0].message ||
                'Sign-in failed after account creation.',
              formId: 'login',
            },
            {status: 401},
          );
        }
      }

      if (!customerAccessToken?.accessToken) {
        return json(
          {
            error:
              'Sign-in failed. Please try again or use email and password.',
            formId: 'login',
          },
          {status: 401},
        );
      }

      session.set('customerAccessToken', customerAccessToken);
      return redirect(`${storefront.i18n?.pathPrefix || ''}/account`, {
        headers: {'Set-Cookie': await session.commit()},
      });
    } catch (err) {
      return json(
        {error: 'Failed to process Google login.', formId},
        {status: 500},
      );
    }
  }

  if (!email || !password) {
    return json(
      {error: 'Please provide both email and password.', formId},
      {status: 400},
    );
  }

  try {
    if (formId === 'register') {
      const {customerCreate}: any = await storefront.mutate(
        CUSTOMER_CREATE_MUTATION,
        {variables: {input: {email, password}}},
      );

      if (customerCreate?.customerUserErrors?.length) {
        return json(
          {
            error: customerCreate.customerUserErrors[0].message,
            formId: 'register',
          },
          {status: 400},
        );
      }

      return json({
        success: 'Account created. Please check your email to verify.',
        formId: 'register',
      });
    } else {
      const {customerAccessTokenCreate}: any = await storefront.mutate(
        LOGIN_MUTATION,
        {variables: {input: {email, password}}},
      );

      if (customerAccessTokenCreate?.customerUserErrors?.length) {
        return json(
          {
            error: customerAccessTokenCreate.customerUserErrors[0].message,
            formId: 'login',
          },
          {status: 400},
        );
      }

      const customerAccessToken =
        customerAccessTokenCreate?.customerAccessToken;

      if (!customerAccessToken?.accessToken) {
        return json(
          {error: 'Sign-in failed. Please try again.', formId: 'login'},
          {status: 401},
        );
      }

      session.set('customerAccessToken', customerAccessToken);

      return redirect(`${storefront.i18n?.pathPrefix || ''}/account`, {
        headers: {'Set-Cookie': await session.commit()},
      });
    }
  } catch (error: any) {
    return json(
      {error: error.message || 'Something went wrong.', formId},
      {status: 500},
    );
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <ellipse cx="12" cy="12" rx="9" ry="6" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M3 3l18 18" />
    <path d="M10.5 10.5a3 3 0 0 0 4 4" />
    <path d="M7.5 7.5C5 9 3 12 3 12s3 6 9 6c1.5 0 2.8-.3 4-.9" />
    <path d="M21 12s-3-6-9-6c-.5 0-1 0-1.5.1" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Page Component ───────────────────────────────────────────────────────────
export default function Login() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const data = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const submit = useSubmit();
  const isSubmitting = navigation.state === 'submitting';

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // After a successful registration, switch to sign-in tab
  useEffect(() => {
    if (data?.formId === 'register') {
      if (data?.error) {
        setActiveTab('register');
      } else if (data?.success) {
        setActiveTab('signin');
      }
    }
  }, [data]);

  const isRegister = activeTab === 'register';

  return (
    <div className="relative min-h-screen w-full flex bg-background">
      {/* Ghost Cursor - client only */}
      {isMounted && (
        <Suspense fallback={null}>
          <GhostCursorEnhanced
            primaryColor="#a87441"
            secondaryColor="#D4AF87"
            brightness={0.6}
            edgeIntensity={0.15}
            trailLength={30}
            inertia={0.25}
            grainIntensity={0.02}
            bloomStrength={0.3}
            bloomRadius={0.5}
            bloomThreshold={0.02}
            fadeDelayMs={600}
            fadeDurationMs={1000}
            zIndex={0}
            mixBlendMode="screen"
            hoverIntensity={2}
          />
        </Suspense>
      )}

      {/* Left decorative panel (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: 'url("/brand/silk-texture.webp")'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <Link to="/" className="group block mb-12">
            <img
              src="/brand/logo-icon-only.webp"
              alt="Formé Haus"
              className="w-24 h-24 object-contain mx-auto opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
              loading="eager"
              width={96}
              height={96}
            />
          </Link>
          <h1 className="font-serif text-5xl text-warm mb-4 tracking-wide">
            Formé Haus
          </h1>
          <p className="text-[12px] uppercase tracking-[0.3em] text-taupe">
            Luxury Lifestyle
          </p>
          <div className="mt-16 flex flex-col gap-4 text-left">
            {[
              'Track orders & purchase history',
              'Manage your personal information',
              'Receive exclusive news & offers',
              'Save items to your wishlist',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-bronze flex-shrink-0" />
                <p className="text-taupe text-sm tracking-wide">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:py-12">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-10 group block">
          <img
            src="/brand/logo-icon-only.webp"
            alt="Formé Haus"
            className="w-16 h-16 object-contain mx-auto opacity-75 group-hover:opacity-100 transition-opacity"
            loading="eager"
            width={64}
            height={64}
          />
        </Link>

        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-serif text-3xl md:text-4xl text-warm mb-2">
              {isRegister ? 'Join Formé Haus' : 'Welcome Back'}
            </h2>
            <p className="text-[11px] uppercase tracking-[0.25em] text-taupe">
              {isRegister ? 'Begin Your Journey' : 'Continue Your Journey'}
            </p>
          </div>

          {/* Google SSO */}
          {isMounted && rootData?.googleClientId && (
            <div className="mb-6">
              <Suspense
                fallback={
                  <div className="h-10 bg-surface rounded-full animate-pulse" />
                }
              >
                <GoogleSSOButton
                  clientId={rootData.googleClientId}
                  onSuccess={(credentialResponse: any) => {
                    const formData = new FormData();
                    formData.append('formId', 'googleAuth');
                    formData.append(
                      'credential',
                      credentialResponse.credential || '',
                    );
                    submit(formData, {method: 'post'});
                  }}
                  onError={() => console.log('Google Login Failed')}
                />
              </Suspense>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-bronze/20 flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-taupe">
              or continue with email
            </span>
            <div className="h-px bg-bronze/20 flex-1" />
          </div>

          {/* Tab switcher */}
          <div className="flex gap-6 mb-8 border-b border-bronze/20">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`pb-4 text-sm uppercase tracking-[0.15em] transition-colors relative ${
                activeTab === 'signin' ? 'text-bronze' : 'text-taupe hover:text-warm'
              }`}
            >
              Sign In
              {activeTab === 'signin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`pb-4 text-sm uppercase tracking-[0.15em] transition-colors relative ${
                activeTab === 'register' ? 'text-bronze' : 'text-taupe hover:text-warm'
              }`}
            >
              Create Account
              {activeTab === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze rounded-full" />
              )}
            </button>
          </div>

          {/* Form */}
          <Form method="post" className="space-y-5">
            <input
              type="hidden"
              name="formId"
              value={isRegister ? 'register' : 'login'}
            />

            {/* Error / Success messages */}
            {data?.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-center tracking-wide"
              >
                {data.error}
              </div>
            )}
            {data?.success && !isRegister && (
              <div className="p-3.5 text-[12px] text-bronze bg-bronze/10 border border-bronze/20 rounded-lg text-center tracking-wide">
                {data.success}
              </div>
            )}
            {data?.success && isRegister === false && data?.formId === 'register' && (
              <div className="p-3.5 text-[12px] text-bronze bg-bronze/10 border border-bronze/20 rounded-lg text-center tracking-wide">
                {data.success}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] uppercase tracking-[0.15em] text-taupe mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 text-warm placeholder-taupe/40 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze/30 transition-colors text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] uppercase tracking-[0.15em] text-taupe mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  minLength={isRegister ? 8 : undefined}
                  className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 pr-12 text-warm placeholder-taupe/40 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze/30 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-warm transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {isRegister && (
                <p className="text-taupe/50 text-xs mt-1.5 tracking-wide">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            {/* Forgot password */}
            {!isRegister && (
              <div className="flex justify-end -mt-2">
                <Link
                  to="/account/recover"
                  className="text-[11px] uppercase tracking-[0.12em] text-taupe hover:text-bronze transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-bronze hover:bg-bronze-dark text-white uppercase tracking-[0.2em] text-[11px] font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </Form>

          {/* Back home */}
          <p className="mt-8 text-center text-taupe text-[11px] tracking-wide">
            <Link to="/" className="hover:text-bronze transition-colors underline underline-offset-4">
              Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
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
