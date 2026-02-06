import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import { Form, useNavigation } from '@remix-run/react';
import GhostCursor from '~/components/GhostCursor';
// Force redeploy trigger

export async function loader({ context }: LoaderFunctionArgs) {
  // If already logged in, redirect to account?
  // For now, just render the login page.
  return json({});
}

export async function action({ context }: ActionFunctionArgs) {
  return context.customerAccount.login();
}

export default function Login() {
  const navigation = useNavigation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#AD9686] flex flex-col items-center justify-center text-[#F0EAE6]">
      <GhostCursor
        // Visuals matching brand
        color="#F0EAE6"
        brightness={1.2}
        edgeIntensity={0}

        // Trail and motion
        trailLength={50}
        inertia={0.4}

        // Post-processing
        grainIntensity={0.08}
        bloomStrength={0.15}
        bloomRadius={0.5}
        bloomThreshold={0}

        // Fade-out behavior
        fadeDelayMs={1000}
        fadeDurationMs={1500}

        zIndex={0}
      />

      <div className="relative z-10 flex flex-col items-center gap-12 p-8">
        {/* Logo Image with Hover Brightness */}
        <div className="group cursor-default transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(240,234,230,0.6)]">
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus - Where Essence Meets Elegance"
            className="w-full max-w-[200px] h-auto object-contain opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:brightness-110 group-hover:scale-105"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-[#F0EAE6]">
            FORMÉ HAUS
          </h1>
          <p className="text-xs md:text-sm tracking-[0.3em] font-sans text-[#F0EAE6]/80">
            Where Essence Meets Elegance
          </p>
        </div>

        {/* Login Button */}
        <Form method="post">
          <button
            type="submit"
            className="px-12 py-4 border border-[#F0EAE6]/30 bg-[#F0EAE6]/5 hover:bg-[#F0EAE6]/10 text-[#F0EAE6] uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:border-[#F0EAE6]/60 backdrop-blur-sm rounded-sm"
            disabled={navigation.state === 'submitting'}
          >
            {navigation.state === 'submitting' ? 'Accessing...' : 'Enter Formé Haus'}
          </button>
        </Form>
      </div>
    </div>
  );
}


