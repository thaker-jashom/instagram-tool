import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
      };

    return (
        <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', marginBottom: '2rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Influencer Dashboard</h1>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/fetch-influencers" style={{ textDecoration: 'none', color: '#64748b' }}>Search</Link>
                    <Link to="/saved-searches" style={{ textDecoration: 'none', color: '#64748b' }}>Saved Searches</Link>
                    <Link to="/saved-influencers" style={{ textDecoration: 'none', color: '#64748b' }}>Saved Influencers</Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            padding: '6px 12px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
