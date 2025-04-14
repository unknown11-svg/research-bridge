import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const GoogleLoginButton = () => {
  const { login } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          await login(credentialResponse.credential);
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Login failed:', error);
        }
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      useOneTap
      auto_select
      theme="filled_blue"
      size="large"
      text="continue_with"
      shape="rectangular"
    />
  );
};

export default GoogleLoginButton;