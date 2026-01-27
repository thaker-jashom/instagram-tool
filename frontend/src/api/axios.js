import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ ADD THIS BLOCK
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // JWT saved on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;