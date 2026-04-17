import {GoogleOAuthProvider, GoogleLogin, type CredentialResponse} from '@react-oauth/google';

export function GoogleSSOButton({
  clientId,
  onSuccess,
  onError,
}: {
  clientId: string;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
}) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="filled_black"
        shape="pill"
        text="continue_with"
      />
    </GoogleOAuthProvider>
  );
}
