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

// Handle expired token - but NOT for login/register pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't do anything on 401 errors - let the component handle it
    // The redirect will be handled by ProtectedRoute component
    return Promise.reject(error);
  }
);

export default api;