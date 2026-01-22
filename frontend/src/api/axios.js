import axios from "axios";

// Get base URL from environment variable
// Vite uses VITE_ prefix for client-side environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;