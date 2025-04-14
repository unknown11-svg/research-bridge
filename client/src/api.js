import axios from 'axios';
import { useAuth } from './context/AuthContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const res = await axios.post('/api/auth/refresh');
        localStorage.setItem('accessToken', res.data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        const { logout } = useAuth();
        await logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;