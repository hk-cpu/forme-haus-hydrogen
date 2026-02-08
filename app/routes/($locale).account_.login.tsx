import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { Form, useActionData, useNavigation, Link, useSearchParams } from '@remix-run/react';
import { useState, useEffect } from 'react';
import GhostCursorEnhanced from '~/components/GhostCursorEnhanced';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { session } = context;

  if (await session.get('customerAccessToken')) {
    return redirect('/account');
  }

  return json({});
}

export async function action({ context, request }: ActionFunctionArgs) {
  const { storefront, session } = context;
  const formData = await request.formData();
  const formId = String(formData.get('formId'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  if (!email || !password) {
    return json({ error: 'Please provide both email and password.', formId }, { status: 400 });
  }

  try {
    if (formId === 'register') {
      const { data, errors } = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
        variables: {
          input: { email, password },
        },
      });

      if (errors?.length) {
        return json({ error: errors[0].message, formId: 'register' }, { status: 400 });
      }

      if (data?.customerCreate?.customerUserErrors?.length) {
        return json(
          { error: data.customerCreate.customerUserErrors[0].message, formId: 'register' },
          { status: 400 },
        );
      }

      return json({ success: 'Account created. Please check your email to verify.', formId: 'register' });
    } else {
      // Login
      const { data, errors } = await storefront.mutate(
        LOGIN_MUTATION,
        {
          variables: {
            input: { email, password },
          },
        },
      );

      if (errors?.length) {
        return json({ error: errors[0].message, formId: 'login' }, { status: 400 });
      }

      if (data?.customerAccessTokenCreate?.customerUserErrors?.length) {
        return json(
          { error: data.customerAccessTokenCreate.customerUserErrors[0].message, formId: 'login' },
          { status: 400 },
        );
      }

      const { customerAccessToken } = data?.customerAccessTokenCreate || {};

      if (!customerAccessToken?.accessToken) {
        return json({ error: 'Invalid credentials.', formId: 'login' }, { status: 401 });
      }

      session.set('customerAccessToken', customerAccessToken);

      return redirect('/account', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }
  } catch (error: any) {
    return json({ error: error.message || 'Something went wrong.', formId }, { status: 500 });
  }
}

export default function Login() {
  const data = useActionData<typeof action>();
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F9F5F0] flex flex-col items-center justify-center text-[#2C2419] pt-24">
      {/* Darker Ghost Cursor with Bronze hover effect */}
      <GhostCursorEnhanced
        primaryColor="#0A0A0A"
        secondaryColor="#a87441"
        brightness={0.8}
        edgeIntensity={0.2}
        trailLength={50}
        inertia={0.25}
        grainIntensity={0.03}
        bloomStrength={0.4}
        bloomRadius={0.6}
        bloomThreshold={0.02}
        fadeDelayMs={600}
        fadeDurationMs={1000}
        zIndex={0}
        mixBlendMode="normal"
        hoverIntensity={2.5}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 p-8 w-full max-w-md transition-all duration-500">
        {/* Logo Image */}
        <div className="group cursor-default transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(168,116,65,0.3)]">
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus - Where Essence Meets Elegance"
            className="w-full max-w-[140px] h-auto object-contain opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[#2C2419]">
            {isRegistering ? 'JOIN FORMÉ HAUS' : 'WELCOME BACK'}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.3em] font-sans text-[#5A5046] font-medium">
            {isRegistering ? 'BEGIN YOUR JOURNEY' : 'CONTINUE YOUR JOURNEY'}
          </p>
        </div>

        {/* Unified Form with White Background and Dark Inputs */}
        <Form method="post" className="w-full space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-[#a87441]/20 shadow-2xl shadow-[#a87441]/10">
          <input type="hidden" name="formId" value={isRegistering ? 'register' : 'login'} />

          {data?.error && (
            <div className="p-3 text-sm text-red-100 bg-red-900/80 border border-red-100/20 rounded text-center font-light tracking-wide">
              {data.error}
            </div>
          )}

          {data?.success && isRegistering && (
            <div className="p-3 text-sm text-[#2C2419] bg-[#a87441]/20 border border-[#a87441]/30 rounded text-center font-medium tracking-wide">
              {data.success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="EMAIL ADDRESS"
                required
                className="login-input w-full bg-[#1A1A1A] border border-[#a87441]/30 py-4 px-6 text-white placeholder-white/50 focus:outline-none focus:bg-[#0A0A0A] focus:text-white focus:border-[#a87441] focus:shadow-[0_0_20px_rgba(168,116,65,0.5)] transition-all duration-500 text-center tracking-[0.15em] text-xs font-medium rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="PASSWORD"
                required
                className="login-input w-full bg-[#1A1A1A] border border-[#a87441]/30 py-4 px-6 text-white placeholder-white/50 focus:outline-none focus:bg-[#0A0A0A] focus:text-white focus:border-[#a87441] focus:shadow-[0_0_20px_rgba(168,116,65,0.5)] transition-all duration-500 text-center tracking-[0.15em] text-xs font-medium rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-12 py-4 border border-[#a87441] bg-[#a87441] text-white hover:bg-[#8B5E3C] uppercase tracking-[0.25em] text-[10px] sm:text-xs transition-all duration-500 hover:scale-[1.02] shadow-lg shadow-[#a87441]/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'PROCESSING...' : (isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN')}
            </button>

            <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-widest text-[#5A5046]">
              {!isRegistering && (
                <Link to="/account/recover" className="hover:text-[#a87441] transition-colors border-b border-transparent hover:border-[#a87441]/50 pb-0.5">
                  Forgot Password?
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  // Clear errors when switching
                }}
                className="hover:text-[#a87441] transition-colors font-semibold border-b border-transparent hover:border-[#a87441] pb-0.5"
              >
                {isRegistering ? "Already have an account? Sign In" : "New to Formé Haus? Create Account"}
              </button>
            </div>
          </div>
        </Form>
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
