import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        // Set up a response interceptor for this protected route
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                // If we get a 401 error while in a protected route, redirect to login
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login', { replace: true });
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
