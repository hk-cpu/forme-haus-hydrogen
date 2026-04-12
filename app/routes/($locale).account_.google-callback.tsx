import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Google OAuth callback handler.
 *
 * Flow:
 * 1. Verify CSRF state
 * 2. Exchange authorization code for access token
 * 3. Fetch Google user info (email + sub/id)
 * 4. Derive a deterministic password from the Google user ID (HMAC-SHA256)
 * 5. Try to log in; if that fails, create the customer then log in
 * 6. Set customerAccessToken in session and redirect to /account
 *
 * If the customer already has a manually-set password that differs from the
 * derived one, they are redirected to the standard login page with a message.
 */
export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront, env} = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = session.get('googleOAuthState') as string | undefined;

  // Clear stored state immediately
  session.unset('googleOAuthState');

  // Verify CSRF state
  if (!state || !storedState || state !== storedState) {
    return redirect('/account/login?error=Invalid+security+token.+Please+try+again.');
  }

  if (!code) {
    return redirect('/account/login?error=Google+sign-in+was+cancelled.');
  }

  const clientId = (env as any).GOOGLE_CLIENT_ID as string | undefined;
  const clientSecret = (env as any).GOOGLE_CLIENT_SECRET as string | undefined;
  const ssoSecret = (env as any).GOOGLE_SSO_SECRET as string | undefined;

  if (!clientId || !clientSecret) {
    return redirect('/account/login?error=Google+sign-in+is+not+configured.');
  }

  const origin = url.origin;
  const redirectUri = `${origin}/account/google-callback`;

  try {
    // ── 1. Exchange code for tokens ────────────────────────────────────────
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
    };

    if (!tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData.error);
      return redirect('/account/login?error=Google+authentication+failed.');
    }

    // ── 2. Fetch Google user info ──────────────────────────────────────────
    const userRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {Authorization: `Bearer ${tokenData.access_token}`},
      },
    );

    const googleUser = (await userRes.json()) as {
      email?: string;
      id?: string;
      name?: string;
    };

    if (!googleUser.email || !googleUser.id) {
      return redirect('/account/login?error=Could+not+retrieve+your+Google+account+details.');
    }

    // ── 3. Derive deterministic password ──────────────────────────────────
    // Uses HMAC-SHA256 (Web Crypto — available in Cloudflare Workers)
    const encoder = new TextEncoder();
    const secret = ssoSecret || 'forme-haus-google-sso-default-secret';
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      {name: 'HMAC', hash: 'SHA-256'},
      false,
      ['sign'],
    );
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(googleUser.id),
    );
    const googlePassword = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const {email} = googleUser;

    // ── 4. Attempt login ───────────────────────────────────────────────────
    let accessToken: {accessToken: string; expiresAt: string} | null = null;

    const loginResult: any = await storefront.mutate(LOGIN_MUTATION, {
      variables: {input: {email, password: googlePassword}},
    });

    const loginToken =
      loginResult?.data?.customerAccessTokenCreate?.customerAccessToken;
    if (loginToken?.accessToken) {
      accessToken = loginToken;
    } else {
      // ── 5. Login failed — try to create the customer ───────────────────
      const createResult: any = await storefront.mutate(
        CUSTOMER_CREATE_MUTATION,
        {
          variables: {input: {email, password: googlePassword}},
        },
      );

      const createErrors =
        createResult?.data?.customerCreate?.customerUserErrors ?? [];

      if (createErrors.length > 0) {
        const firstError = createErrors[0] as {code: string; message: string};

        if (firstError.code === 'TAKEN') {
          // Existing account — email is already registered with a different
          // password (customer signed up directly). Don't create a duplicate.
          return redirect(
            '/account/login?error=Existing+account+found.+Please+sign+in+with+your+email+and+password.',
          );
        }

        return redirect(
          `/account/login?error=${encodeURIComponent(firstError.message)}`,
        );
      }

      // Account created — now log in
      const loginAfterCreate: any = await storefront.mutate(LOGIN_MUTATION, {
        variables: {input: {email, password: googlePassword}},
      });

      const newToken =
        loginAfterCreate?.data?.customerAccessTokenCreate?.customerAccessToken;
      if (newToken?.accessToken) {
        accessToken = newToken;
      }
    }

    if (!accessToken) {
      return redirect('/account/login?error=Google+sign-in+failed.+Please+try+again.');
    }

    // ── 6. Persist token and redirect ─────────────────────────────────────
    session.set('customerAccessToken', accessToken);

    return redirect('/account', {
      headers: {'Set-Cookie': await session.commit()},
    });
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return redirect(
      `/account/login?error=${encodeURIComponent('Something went wrong with Google sign-in.')}`,
    );
  }
}

// ── GraphQL mutations ──────────────────────────────────────────────────────

const LOGIN_MUTATION = `#graphql
  mutation googleSsoLogin($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        message
      }
    }
  }
` as const;

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation googleSsoRegister($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
` as const;
