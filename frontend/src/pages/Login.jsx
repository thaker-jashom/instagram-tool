import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Clear any existing token when component mounts
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleEmailChange = (e) => {
        // Convert email to lowercase automatically
        setEmail(e.target.value.toLowerCase());
        setError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Clear any old token before attempting login
        localStorage.removeItem('token');

        console.log('🔵 Attempting login with:', email);

        try {
            const response = await api.post('/auth/login', { email: email.toLowerCase(), password });
            console.log('✅ Login successful:', response.data);
            localStorage.setItem("token", response.data.token);
            navigate('/fetch-influencers');
        } catch (err) {
            console.error('❌ Login failed:', err);
            console.error('❌ Error response:', err.response);
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage === 'Invalid credentials' 
                ? 'Invalid email or password. Please try again.' 
                : errorMessage
            );
            console.log('🔴 Error set:', errorMessage);
        } finally {
            setLoading(false);
            console.log('🔵 Login attempt complete');
        }
    };

    return (
        <div className="auth-split-container">
            {/* Left Side - Image */}
            <div className="auth-image-side">
                <img 
                    src="/login-image.jpg.jpg" 
                    alt="Food Influencer" 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                    }} 
                />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, rgba(26, 31, 46, 0.3) 0%, transparent 100%)',
                    pointerEvents: 'none'
                }}></div>
            </div>

            {/* Right Side - Login Form with Background */}
            <div className="auth-form-side">
                <div className="auth-bg-image">
                    <img src="/login-bg.png.jpg" alt="Background" />
                </div>

                <div className="auth-form-container">
                    <div className="auth-form-card">
                        <h2 style={{
                            marginBottom: '8px',
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.5px'
                        }}>Welcome Back</h2>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                            marginBottom: '32px'
                        }}>Sign in to your account</p>
                        <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)',
                            marginBottom: '32px',
                            borderRadius: '2px'
                        }}></div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '8px', padding: '12px' }}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div style={{ 
                                textAlign: 'center', 
                                marginTop: '24px', 
                                paddingTop: '24px', 
                                borderTop: '1px solid var(--border)' 
                            }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Don't have an account? <Link to="/register" style={{ 
                                        color: 'var(--gold)', 
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}>Create Account</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
