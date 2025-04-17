import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';
import Homepage from './pages/Homepage';
import VerifyPage from './pages/VerifyPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route
            path="/dashboard"
            element={
        
                <DashboardPage />
        
            }
          />
          <Route path="*" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
