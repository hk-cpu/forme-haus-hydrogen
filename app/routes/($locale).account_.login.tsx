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
} from '@remix-run/react';
import {useState, useEffect, Suspense, lazy} from 'react';

// Lazy load GhostCursorEnhanced to prevent SSR issues with three.js
const GhostCursorEnhanced = lazy(
  () => import('~/components/GhostCursorEnhanced.client'),
);

export async function loader({context, request}: LoaderFunctionArgs) {
  const {session} = context;

  if (await session.get('customerAccessToken')) {
    return redirect('/account');
  }

  return json({});
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
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';

  // Default to registering if register params exists or if previous action was register
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (data?.formId === 'register' && data?.error) {
      setIsRegistering(true);
    }
  }, [data]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-[#2C2419]"
      style={{backgroundImage: 'url("/brand/silk-texture.webp")'}}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      {/* Ghost Cursor - Client only */}
      <Suspense fallback={null}>
        <GhostCursorEnhanced
          primaryColor="#ffffff"
          secondaryColor="#a87441"
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
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 md:p-12 overflow-hidden relative">
          {/* Subtle top glare */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>

          {/* Logo & Header */}
          <div className="flex flex-col items-center gap-6 mb-10">
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
                className="font-serif text-3xl md:text-4xl text-[#2C2419]"
                style={{letterSpacing: '0.02em'}}
              >
                {isRegistering ? 'Join Formé Haus' : 'Welcome Back'}
              </h1>
              <p className="text-[11px] tracking-[0.25em] font-sans text-[#8B8076] uppercase">
                {isRegistering ? 'Begin Your Journey' : 'Continue Your Journey'}
              </p>
            </div>
          </div>

          {/* Form */}
          <Form method="post" className="w-full space-y-6">
            <input
              type="hidden"
              name="formId"
              value={isRegistering ? 'register' : 'login'}
            />

            {data?.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 text-[12px] text-[#8B3A3A] bg-[#FDF2F2] border border-[#E8C4C4] rounded-lg text-center tracking-wide"
              >
                {data.error}
              </div>
            )}

            {data?.success && isRegistering && (
              <div className="p-3.5 text-[12px] text-[#2C2419] bg-[#a87441]/10 border border-[#a87441]/20 rounded-lg text-center tracking-wide">
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
                  className="peer w-full bg-[#fcfbf9] border border-[#E5DFD9] pt-6 pb-2 px-4 text-[#2C2419] focus:outline-none focus:border-[#a87441] focus:bg-white focus:ring-1 focus:ring-[#a87441]/30 transition-all duration-300 text-[14px] font-medium tracking-wide rounded-xl shadow-inner shadow-black/[0.01]"
                />
                <label
                  htmlFor="email"
                  className="absolute text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] top-4 left-4 transition-all duration-300 transform -translate-y-2.5 scale-[0.85] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-2.5 peer-focus:text-[#a87441] pointer-events-none"
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
                  className="peer w-full bg-[#fcfbf9] border border-[#E5DFD9] pt-6 pb-2 px-4 text-[#2C2419] focus:outline-none focus:border-[#a87441] focus:bg-white focus:ring-1 focus:ring-[#a87441]/30 transition-all duration-300 text-[14px] font-medium tracking-wide rounded-xl shadow-inner shadow-black/[0.01]"
                />
                <label
                  htmlFor="password"
                  className="absolute text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] top-4 left-4 transition-all duration-300 transform -translate-y-2.5 scale-[0.85] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-2.5 peer-focus:text-[#a87441] pointer-events-none"
                >
                  Password
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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

              <div className="flex flex-col items-center gap-3 pt-2">
                {!isRegistering && (
                  <Link
                    to="/account/recover"
                    className="text-[10px] uppercase tracking-[0.15em] text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300"
                  >
                    Forgot Password?
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[10px] uppercase tracking-[0.15em] text-[#8B8076] hover:text-[#a87441] transition-colors duration-300 font-semibold"
                >
                  {isRegistering
                    ? 'Already have an account? Sign In'
                    : 'New to Formé Haus? Create Account'}
                </button>
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
