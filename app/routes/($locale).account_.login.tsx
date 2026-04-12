import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  Link,
  useSearchParams,
} from '@remix-run/react';
import {useState, useEffect, Suspense, lazy} from 'react';

// Lazy load GhostCursorEnhanced to prevent SSR issues with three.js
const GhostCursorEnhanced = lazy(
  () => import('~/components/GhostCursorEnhanced.client'),
);

export async function loader({context, request}: LoaderFunctionArgs) {
  const {session, env} = context;

  if (await session.get('customerAccessToken')) {
    return redirect('/account');
  }

  const googleConfigured = !!(env as any).GOOGLE_CLIENT_ID;
  const url = new URL(request.url);
  const loginError = url.searchParams.get('error') ?? null;

  return json({googleConfigured, loginError});
}

export async function action({context, request}: ActionFunctionArgs) {
  const {storefront, session} = context;
  const formData = await request.formData();
  const formId = String(formData.get('formId'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  if (!email || !password) {
    return json(
      {error: 'Please provide both email and password.', formId},
      {status: 400},
    );
  }

  try {
    if (formId === 'register') {
      const {data, errors}: any = await storefront.mutate(
        CUSTOMER_CREATE_MUTATION,
        {
          variables: {
            input: {email, password},
          },
        },
      );

      if (errors?.length) {
        return json(
          {error: errors[0].message, formId: 'register'},
          {status: 400},
        );
      }

      if (data?.customerCreate?.customerUserErrors?.length) {
        return json(
          {
            error: data.customerCreate.customerUserErrors[0].message,
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
      // Login
      const {data, errors}: any = await storefront.mutate(LOGIN_MUTATION, {
        variables: {
          input: {email, password},
        },
      });

      if (errors?.length) {
        return json({error: errors[0].message, formId: 'login'}, {status: 400});
      }

      if (data?.customerAccessTokenCreate?.customerUserErrors?.length) {
        return json(
          {
            error: data.customerAccessTokenCreate.customerUserErrors[0].message,
            formId: 'login',
          },
          {status: 400},
        );
      }

      const {customerAccessToken} = data?.customerAccessTokenCreate || {};

      if (!customerAccessToken?.accessToken) {
        return json(
          {error: 'Invalid credentials.', formId: 'login'},
          {status: 401},
        );
      }

      session.set('customerAccessToken', customerAccessToken);

      return redirect('/account', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }
  } catch (error: any) {
    return json(
      {error: error.message || 'Something went wrong.', formId},
      {status: 500},
    );
  }
}

export default function Login() {
  const data = useActionData<typeof action>() as any;
  const loaderData = useLoaderData<typeof loader>() as any;
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';

  // Default to registering if register params exists or if previous action was register
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (data?.formId === 'register') {
      if (data?.error) {
        setIsRegistering(true);
      } else if (data?.success) {
        // Automatically slide to Sign In upon successful registration
        setIsRegistering(false);
      }
    }
  }, [data]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-brand-text"
      style={{backgroundImage: 'url("/brand/silk-texture.webp")'}}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      {/* Ghost Cursor - Client only */}
      <Suspense fallback={null}>
        <GhostCursorEnhanced
          primaryColor="#ffffff"
          secondaryColor={getComputedStyle(document.documentElement).getPropertyValue('--bronze') || '#a87441'}
          brightness={0.8}
          edgeIntensity={0.2}
          trailLength={40}
          inertia={0.2}
          grainIntensity={0.03}
          bloomStrength={0.4}
          bloomRadius={0.6}
          bloomThreshold={0.02}
          fadeDelayMs={600}
          fadeDurationMs={1000}
          zIndex={0}
          mixBlendMode="overlay"
          hoverIntensity={2.5}
        />
      </Suspense>

      <div className="relative z-10 w-full max-w-[480px] mx-auto px-6 py-12">
          {/* Unified White Container */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/50 p-6 md:p-8 lg:p-12 overflow-hidden relative">
            {/* Subtle top glare */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>

            {/* Logo & Header */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <Link to="/" className="group cursor-pointer">
                <img
                  src="/brand/logo-icon-only.webp"
                  alt="Formé Haus"
                  className="w-20 h-20 object-contain opacity-85 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={40}
                  height={40}
                />
              </Link>

              <div className="text-center space-y-2">
                <h1
                  className="font-serif text-3xl md:text-4xl text-brand-text"
                  style={{letterSpacing: '0.02em'}}
                >
                  {isRegistering ? 'Join Formé Haus' : 'Welcome Back'}
                </h1>
                <p className="text-[11px] tracking-[0.25em] font-sans text-taupe uppercase">
                  {isRegistering ? 'Begin Your Journey' : 'Continue Your Journey'}
                </p>
              </div>
            </div>

            {/* Segmented Control UI */}
            <div className="flex bg-cream border border-warm rounded-xl p-1 mb-8 relative">
              <div 
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-400 ease-[0.16,1,0.3,1] z-0"
                style={{
                  left: isRegistering ? 'calc(50% + 2px)' : '4px'
                }}
              />
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className={`flex-1 py-3.5 text-[11px] uppercase tracking-widest font-semibold z-10 transition-colors duration-300 ${!isRegistering ? 'text-bronze' : 'text-taupe hover:text-bronze'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className={`flex-1 py-3.5 text-[11px] uppercase tracking-widest font-semibold z-10 transition-colors duration-300 ${isRegistering ? 'text-bronze' : 'text-taupe hover:text-bronze'}`}
              >
                Register
              </button>
            </div>

            {/* Google SSO */}
            {loaderData?.googleConfigured && (
              <div className="mb-6">
                <a
                  href="/account/google"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-warm rounded-xl text-brand-text text-sm hover:border-bronze/40 hover:shadow-sm transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </a>
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-warm" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-taupe">or</span>
                  <div className="flex-1 h-px bg-warm" />
                </div>
              </div>
            )}

            {/* Form */}
            <Form method="post" className="w-full space-y-6">
              <input
                type="hidden"
                name="formId"
                value={isRegistering ? 'register' : 'login'}
              />

            {loaderData?.loginError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 text-[12px] text-bronze-dark bg-bronze/10 border border-bronze/30 rounded-lg text-center tracking-wide"
              >
                {loaderData.loginError}
              </div>
            )}

            {data?.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 text-[12px] text-bronze-dark bg-bronze/10 border border-bronze/30 rounded-lg text-center tracking-wide"
              >
                {data.error}
              </div>
            )}

            {data?.success && !isRegistering && (
              <div className="p-3.5 text-[12px] text-brand-text bg-bronze/10 border border-bronze/20 rounded-lg text-center tracking-wide animate-in fade-in zoom-in duration-300">
                {data.success}
              </div>
            )}

            <div className="space-y-5">
              {/* Floating Label Input: Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=" "
                  required
                  autoComplete="email"
                  className="peer w-full bg-cream border border-warm pt-6 pb-2 px-4 text-brand-text focus:outline-none focus:border-bronze focus:bg-white focus:ring-1 focus:ring-bronze/30 focus-visible:ring-1 focus-visible:ring-bronze/50 transition-all duration-300 text-[14px] font-medium tracking-wide rounded-xl shadow-inner shadow-black/[0.01]"
                />
                <label
                  htmlFor="email"
                  className="absolute text-[11px] uppercase tracking-[0.2em] text-taupe top-4 left-4 transition-all duration-300 transform -translate-y-2.5 scale-[0.85] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-2.5 peer-focus:text-bronze pointer-events-none"
                >
                  Email Address
                </label>
              </div>

              {/* Floating Label Input: Password */}
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=" "
                  required
                  autoComplete={
                    isRegistering ? 'new-password' : 'current-password'
                  }
                  className="peer w-full bg-cream border border-warm pt-6 pb-2 px-4 text-brand-text focus:outline-none focus:border-bronze focus:bg-white focus:ring-1 focus:ring-bronze/30 focus-visible:ring-1 focus-visible:ring-bronze/50 transition-all duration-300 text-[14px] font-medium tracking-wide rounded-xl shadow-inner shadow-black/[0.01]"
                />
                <label
                  htmlFor="password"
                  className="absolute text-[11px] uppercase tracking-[0.2em] text-taupe top-4 left-4 transition-all duration-300 transform -translate-y-2.5 scale-[0.85] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-2.5 peer-focus:text-bronze pointer-events-none"
                >
                  Password
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-bronze text-white hover:bg-bronze-dark uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : isRegistering ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="flex flex-col items-center gap-3 pt-4">
                {!isRegistering && (
                  <Link
                    to="/account/recover"
                    className="text-[10px] uppercase tracking-[0.15em] text-taupe hover:text-bronze transition-colors duration-300"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
            </div>
          </Form>
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
