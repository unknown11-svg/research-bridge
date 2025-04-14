import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-container">
      <h1>Research Bridge</h1>
      <div className="wits-login-notice">
        <p>Please sign in with your Wits student email (@students.wits.ac.za)</p>
      </div>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;