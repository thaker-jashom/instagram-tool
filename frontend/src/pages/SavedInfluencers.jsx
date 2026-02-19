import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const SavedInfluencers = () => {
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchInfluencers();
    }, []);

    const fetchInfluencers = async () => {
        try {
            const response = await api.get('/saved-influencers');
            setInfluencers(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch saved influencers');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (influencerId, influencerName) => {
        // Optimistic update - remove from UI immediately
        const originalInfluencers = [...influencers];
        setInfluencers(influencers.filter(inf => inf.id !== influencerId));
        
        try {
            await api.delete(`/saved-influencers/${influencerId}`);
            setModalState({
                isOpen: true,
                title: 'Influencer Removed',
                message: `${influencerName} has been removed from your saved influencers.`,
                type: 'success'
            });
        } catch (err) {
            // Revert on error
            setInfluencers(originalInfluencers);
            setModalState({
                isOpen: true,
                title: 'Remove Failed',
                message: err.response?.data?.message || 'Failed to remove influencer. Please try again.',
                type: 'error'
            });
        }
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    const handleViewDetails = (influencer) => {
        setSelectedInfluencer(influencer);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedInfluencer(null);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ 
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <h2 style={{ margin: 0 }}>Saved Influencers</h2>
                    <span style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '0.95rem' 
                    }}>
                        {influencers.length} {influencers.length === 1 ? 'influencer' : 'influencers'}
                    </span>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Loading...
                    </div>
                ) : influencers.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                            No saved influencers yet. Start discovering and save your favorites!
                        </p>
                    </div>
                ) : (
                    <div className="influencers-grid">
                        {influencers.map((inf) => (
                            <div 
                                key={inf.id} 
                                className="influencer-card"
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                {/* Platform Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: inf.platform === 'YOUTUBE' ? '#FF0000' : '#E4405F',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {inf.platform}
                                </div>

                                {/* Profile Section */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: '0 0 0.5rem 0',
                                        paddingRight: '80px'
                                    }}>
                                        {inf.fullName}
                                    </h3>
                                    <p style={{
                                        fontSize: '1rem',
                                        color: 'var(--text-muted)',
                                        margin: 0
                                    }}>
                                        @{inf.username}
                                    </p>
                                </div>

                                {/* Stats Section */}
                                <div style={{
                                    display: 'flex',
                                    gap: '2rem',
                                    marginBottom: '1.25rem',
                                    padding: '1rem',
                                    background: 'var(--bg-primary)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    flexWrap: 'wrap'
                                }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            margin: '0 0 0.25rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Followers
                                        </p>
                                        <p style={{
                                            fontSize: '1.4rem',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            margin: 0
                                        }}>
                                            {formatNumber(inf.followerCount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            margin: '0 0 0.25rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {inf.platform === 'YOUTUBE' ? 'Videos' : 'Posts'}
                                        </p>
                                        <p style={{
                                            fontSize: '1.4rem',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            margin: 0
                                        }}>
                                            {formatNumber(inf.postsCount || 0)}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.5',
                                        margin: 0,
                                        minHeight: '60px'
                                    }}>
                                        {inf.bio ? (inf.bio.length > 120 ? inf.bio.substring(0, 120) + '...' : inf.bio) : 'No bio available'}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border)',
                                    gap: '0.75rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        Saved {new Date(inf.createdAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '0.5rem'
                                    }}>
                                        <button
                                            onClick={() => handleViewDetails(inf)}
                                            style={{
                                                background: 'var(--gold)',
                                                border: 'none',
                                                color: 'var(--bg-primary)',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleUnsave(inf.id, inf.fullName)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for success/error messages */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedInfluencer && (
                <div 
                    onClick={closeDetailModal}
                    className="detail-modal-overlay"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="detail-modal-content"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeDetailModal}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '1.5rem',
                                zIndex: 1,
                                transition: 'all 0.2s',
                                fontWeight: '300'
                            }}
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div style={{
                            padding: '2.5rem',
                            borderBottom: '1px solid var(--border)',
                            position: 'relative'
                        }}>
                            <div style={{
                                background: selectedInfluencer.platform === 'YOUTUBE' ? '#FF0000' : '#E4405F',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                                display: 'inline-block',
                                marginBottom: '1.5rem'
                            }}>
                                {selectedInfluencer.platform}
                            </div>

                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem',
                                letterSpacing: '-0.5px'
                            }}>
                                {selectedInfluencer.fullName}
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-muted)',
                                margin: 0
                            }}>
                                @{selectedInfluencer.username}
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className={`detail-modal-stats ${selectedInfluencer.platform === 'YOUTUBE' ? 'two-col' : ''}`}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: '700'
                                }}>{selectedInfluencer.platform === 'YOUTUBE' ? 'Subscribers' : 'Followers'}</p>
                                <p style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    color: 'var(--gold)',
                                    margin: 0
                                }}>
                                    {formatNumber(selectedInfluencer.followerCount)}
                                </p>
                            </div>
                            {selectedInfluencer.platform === 'INSTAGRAM' && (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontWeight: '700'
                                    }}>Following</p>
                                    <p style={{
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        color: 'var(--text-primary)',
                                        margin: 0
                                    }}>
                                        {formatNumber(selectedInfluencer.followingCount || 0)}
                                    </p>
                                </div>
                            )}
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: '700'
                                }}>{selectedInfluencer.platform === 'YOUTUBE' ? 'Videos' : 'Posts'}</p>
                                <p style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    color: 'var(--text-primary)',
                                    margin: 0
                                }}>
                                    {formatNumber(selectedInfluencer.postsCount || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div style={{ padding: '2rem' }}>
                            {/* Bio */}
                            {selectedInfluencer.bio && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '800',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>Bio</h3>
                                    <p style={{
                                        fontSize: '1rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.7'
                                    }}>
                                        {selectedInfluencer.bio}
                                    </p>
                                </div>
                            )}

                            {/* Additional Info Grid */}
                            <div className="detail-modal-info-grid">
                                {selectedInfluencer.email && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Email</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500',
                                            wordBreak: 'break-all'
                                        }}>{selectedInfluencer.email}</p>
                                    </div>
                                )}

                                {selectedInfluencer.phone && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Phone</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500'
                                        }}>{selectedInfluencer.phone}</p>
                                    </div>
                                )}

                                {selectedInfluencer.website && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Website</p>
                                        <a 
                                            href={selectedInfluencer.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: '0.95rem',
                                                color: 'var(--gold)',
                                                fontWeight: '500',
                                                textDecoration: 'none',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {selectedInfluencer.website}
                                        </a>
                                    </div>
                                )}

                                {selectedInfluencer.locationCity && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Location</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500'
                                        }}>
                                            {selectedInfluencer.locationCity}{selectedInfluencer.locationCountry && `, ${selectedInfluencer.locationCountry}`}
                                        </p>
                                    </div>
                                )}

                                {selectedInfluencer.engagementRate && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Engagement Rate</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500'
                                        }}>{selectedInfluencer.engagementRate}%</p>
                                    </div>
                                )}

                                {selectedInfluencer.isPrivate !== null && selectedInfluencer.isPrivate !== undefined && selectedInfluencer.platform === 'INSTAGRAM' && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Account Privacy</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500'
                                        }}>{selectedInfluencer.isPrivate ? 'Private' : 'Public'}</p>
                                    </div>
                                )}

                                {selectedInfluencer.businessAccount !== null && selectedInfluencer.businessAccount !== undefined && (
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '700'
                                        }}>Account Type</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '500'
                                        }}>{selectedInfluencer.businessAccount ? 'Business' : 'Personal'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Categories */}
                            {selectedInfluencer.categories && selectedInfluencer.categories.length > 0 && (
                                <div style={{ marginTop: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '800',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>Categories</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {selectedInfluencer.categories.map((cat, index) => (
                                            <span key={index} style={{
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border)',
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-secondary)',
                                                fontWeight: '500'
                                            }}>
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid var(--border)',
                            background: 'var(--bg-primary)'
                        }}>
                            <button
                                onClick={closeDetailModal}
                                style={{
                                    width: '100%',
                                    background: 'var(--gold)',
                                    color: 'var(--bg-primary)',
                                    border: 'none',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SavedInfluencers;
