import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem("token", response.data.token);
            navigate('/fetch-influencers');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: 'var(--shadow-xl)'
    };

    const titleStyle = {
        marginBottom: '8px',
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        letterSpacing: '-0.5px'
    };

    const subtitleStyle = {
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginBottom: '32px'
    };

    const accentLineStyle = {
        height: '3px',
        background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)',
        marginBottom: '32px',
        borderRadius: '2px'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Welcome Back</h2>
                <p style={subtitleStyle}>Sign in to your account</p>
                <div style={accentLineStyle}></div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                </form>
            </div>
        </div>
    );
};

export default Login;
