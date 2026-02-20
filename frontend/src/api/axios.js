import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if:
    // 1. User has a token (they're logged in)
    // 2. The request is NOT to login/register endpoints
    // 3. We're not already on the login page
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/register');
    const isOnLoginPage = window.location.pathname === '/login' || 
                         window.location.pathname === '/register';
    
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem('token') &&
      !isAuthEndpoint &&
      !isOnLoginPage
    ) {
      // 🔥 TOKEN EXPIRED OR INVALID
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;