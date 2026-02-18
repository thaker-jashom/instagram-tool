import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If token is invalid, redirect to login
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (email) => {
        if (!email) return 'U';
        const parts = email.split('@')[0];
        return parts.substring(0, 2).toUpperCase();
    };

    const getDisplayName = (email) => {
        if (!email) return 'User';
        return email.split('@')[0];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <nav style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '0.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                height: '60px'
            }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{
                        width: '6px',
                        height: '6px',
                        background: 'var(--gold)',
                        borderRadius: '50%'
                    }}></span>
                    Food Influencer
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/fetch-influencers" style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }}>
                        Discover
                    </Link>
                    <Link to="/saved-searches" style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }}>
                        Saved Searches
                    </Link>
                    <Link to="/saved-influencers" style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }}>
                        Saved Influencers
                    </Link>
                    
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            color: 'var(--gold)',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                        title="Profile"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Profile Sidebar Modal */}
            {isProfileOpen && (
                <>
                    {/* Overlay */}
                    <div 
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 999,
                            animation: 'fadeIn 0.2s ease'
                        }}
                    />
                    
                    {/* Sidebar */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '320px',
                        background: 'var(--bg-secondary)',
                        borderLeft: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 1000,
                        animation: 'slideInRight 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>Profile</h2>
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    padding: '0',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div style={{
                            flex: 1,
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    border: '2px solid var(--gold)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: '600',
                                    color: 'var(--gold)'
                                }}>
                                    {loading ? '...' : getInitials(user?.email)}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: '0 0 0.25rem 0'
                                    }}>
                                        {loading ? 'Loading...' : getDisplayName(user?.email)}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        margin: 0
                                    }}>
                                        {loading ? '' : user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* User Details */}
                            <div style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: '1.25rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            margin: '0 0 0.25rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Member Since</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            margin: 0,
                                            fontWeight: '500'
                                        }}>{loading ? 'Loading...' : formatDate(user?.createdAt)}</p>
                                    </div>
                                    <div style={{
                                        height: '1px',
                                        background: 'var(--border)'
                                    }}></div>
                                    <div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            margin: '0 0 0.25rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Account Type</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            margin: 0,
                                            fontWeight: '500'
                                        }}>Premium User</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Logout */}
                        <div style={{
                            padding: '1.5rem',
                            borderTop: '1px solid var(--border)'
                        }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
