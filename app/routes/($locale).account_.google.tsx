import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Initiates Google OAuth flow.
 * Redirects to Google's consent page with required params.
 * Stores a CSRF state token in session to verify on callback.
 */
export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, env} = context;
  const clientId = (env as any).GOOGLE_CLIENT_ID as string | undefined;

  if (!clientId) {
    return redirect('/account/login?error=Google+sign-in+is+not+configured');
  }

  // Generate CSRF state token using Web Crypto (available in Cloudflare Workers)
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const state = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  session.set('googleOAuthState', state);

  // Build redirect URI using the request origin (non-locale path)
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/account/google-callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    },
  );
}
