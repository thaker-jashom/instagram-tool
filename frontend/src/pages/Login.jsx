import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        // Convert email to lowercase automatically
        setEmail(e.target.value.toLowerCase());
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email: email.toLowerCase(), password });
            localStorage.setItem("token", response.data.token);
            navigate('/fetch-influencers');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            maxHeight: '100vh',
            height: '100vh',
            background: 'var(--bg-primary)',
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }}>
            {/* Left Side - Image */}
            <div style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                background: '#1a1f2e'
            }}>
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
                {/* Optional overlay for better text readability if needed */}
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
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                position: 'relative',
                overflow: 'auto'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0
                }}>
                    <img 
                        src="/login-bg.png.jpg" 
                        alt="Background" 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 0.35
                        }} 
                    />
                </div>

                {/* Form Container */}
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '40px',
                        boxShadow: 'var(--shadow-xl)',
                        backdropFilter: 'blur(10px)'
                    }}>
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
                                    onChange={(e) => setPassword(e.target.value)}
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
