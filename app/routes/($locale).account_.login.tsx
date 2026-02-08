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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#AD9686] flex flex-col items-center justify-center text-[#F0EAE6]">
      <GhostCursorEnhanced
        primaryColor="#000000"
        secondaryColor="#8B5E3C"
        brightness={1.2}
        edgeIntensity={0.15}
        trailLength={60}
        inertia={0.3}
        grainIntensity={0.04}
        bloomStrength={0.25}
        bloomRadius={0.8}
        bloomThreshold={0.01}
        fadeDelayMs={800}
        fadeDurationMs={1200}
        zIndex={0}
        mixBlendMode="normal"
        hoverIntensity={2.0}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 p-8 w-full max-w-md transition-all duration-500">
        {/* Logo Image */}
        <div className="group cursor-default transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(74,60,49,0.4)]">
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus - Where Essence Meets Elegance"
            className="w-full max-w-[160px] h-auto object-contain opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[#F0EAE6]">
            {isRegistering ? 'JOIN FORMÉ HAUS' : 'WELCOME BACK'}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.3em] font-sans text-[#4A3C31]/80 font-medium">
            {isRegistering ? 'BEGIN YOUR JOURNEY' : 'CONTINUE YOUR JOURNEY'}
          </p>
        </div>

        {/* Unified Form */}
        <Form method="post" className="w-full space-y-6 bg-[#F0EAE6]/5 backdrop-blur-md p-8 rounded-sm border border-[#F0EAE6]/10 shadow-2xl">
          <input type="hidden" name="formId" value={isRegistering ? 'register' : 'login'} />

          {data?.error && (
            <div className="p-3 text-sm text-red-100 bg-red-900/10 border border-red-100/10 rounded text-center font-light tracking-wide">
              {data.error}
            </div>
          )}

          {data?.success && isRegistering && (
            <div className="p-3 text-sm text-[#4A3C31] bg-[#F0EAE6]/80 border border-[#4A3C31]/10 rounded text-center font-medium tracking-wide">
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
                className="login-input w-full bg-white/90 border border-[#4A3C31]/10 py-4 px-6 text-[#4A3C31] placeholder-[#4A3C31]/50 focus:outline-none focus:bg-[#121212] focus:text-white focus:border-[#8B5E3C] focus:shadow-[0_0_20px_rgba(139,94,60,0.4)] transition-all duration-500 text-center tracking-[0.15em] text-xs font-medium rounded-sm"
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
                className="login-input w-full bg-white/90 border border-[#4A3C31]/10 py-4 px-6 text-[#4A3C31] placeholder-[#4A3C31]/50 focus:outline-none focus:bg-[#121212] focus:text-white focus:border-[#8B5E3C] focus:shadow-[0_0_20px_rgba(139,94,60,0.4)] transition-all duration-500 text-center tracking-[0.15em] text-xs font-medium rounded-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-12 py-4 border border-[#4A3C31]/30 bg-[#4A3C31] text-[#F0EAE6] hover:bg-[#5C5046] uppercase tracking-[0.25em] text-[10px] sm:text-xs transition-all duration-500 hover:scale-[1.02] shadow-lg rounded-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'PROCESSING...' : (isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN')}
            </button>

            <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-widest text-[#4A3C31]/60">
              {!isRegistering && (
                <Link to="/account/recover" className="hover:text-[#4A3C31] transition-colors border-b border-transparent hover:border-[#4A3C31]/30 pb-0.5">
                  Forgot Password?
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  // Clear errors when switching
                }}
                className="hover:text-[#4A3C31] transition-colors font-semibold border-b border-transparent hover:border-[#4A3C31] pb-0.5"
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
