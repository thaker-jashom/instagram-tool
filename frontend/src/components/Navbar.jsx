import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navStyle = {
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '1.2rem 0',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const titleStyle = {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const accentDot = {
        width: '8px',
        height: '8px',
        background: 'var(--gold)',
        borderRadius: '50%'
    };

    const linksContainer = {
        display: 'flex',
        gap: '32px',
        alignItems: 'center'
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        fontWeight: '500',
        letterSpacing: '0.3px'
    };

    const logoutButtonStyle = {
        background: 'transparent',
        color: 'var(--error)',
        border: '1px solid var(--error)',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '500'
    };

    return (
        <nav style={navStyle}>
            <div className="container" style={containerStyle}>
                <h1 style={titleStyle}>
                    <span style={accentDot}></span>
                    Influencer Dashboard
                </h1>
                <div style={linksContainer}>
                    <Link to="/fetch-influencers" style={linkStyle}>Search</Link>
                    <Link to="/saved-searches" style={linkStyle}>Saved Searches</Link>
                    <Link to="/saved-influencers" style={linkStyle}>Saved Influencers</Link>
                    <button onClick={handleLogout} style={logoutButtonStyle}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
