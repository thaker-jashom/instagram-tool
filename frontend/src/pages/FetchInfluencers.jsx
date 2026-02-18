import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const FetchInfluencers = () => {
    const [formData, setFormData] = useState({
        platform: 'youtube',
        hashtags: '',
        minFollowers: '',
        maxFollowers: '',
        city: '',
        country: 'IN'
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchSaved, setSearchSaved] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        };
    }, []);

    const getHashtagsArray = (str) => {
        return str.split(/[\s,]+/).filter(tag => tag.trim() !== '').map(tag => tag.replace('#', ''));
    };

    const validate = () => {
        const min = formData.minFollowers ? parseInt(formData.minFollowers) : 0;
        const max = formData.maxFollowers ? parseInt(formData.maxFollowers) : 0;
        const hashtags = getHashtagsArray(formData.hashtags);

        if (hashtags.length === 0) return "At least one hashtag is required";
        if (formData.minFollowers && formData.maxFollowers && min > max) {
            return "Min followers cannot be greater than Max followers";
        }
        return null;
    };

    const handleFetch = async (e) => {
        e.preventDefault();
        setError(null);
        setSearchSaved(false);

        const valError = validate();
        if (valError) {
            setError(valError);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                platform: formData.platform,
                hashtags: getHashtagsArray(formData.hashtags),
                minFollowers: formData.minFollowers ? parseInt(formData.minFollowers) : undefined,
                maxFollowers: formData.maxFollowers ? parseInt(formData.maxFollowers) : undefined,
                location: {
                    city: formData.city,
                    country: formData.country
                }
            };

            const endpoint = formData.platform === 'instagram' ? '/instagram/fetch' : '/youtube/fetch';
            const response = await api.post(endpoint, payload);
            setResults(response.data.data.influencers || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch influencers');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSearch = async () => {
        try {
            const payload = {
                hashtags: getHashtagsArray(formData.hashtags),
                minFollowers: formData.minFollowers ? parseInt(formData.minFollowers) : undefined,
                maxFollowers: formData.maxFollowers ? parseInt(formData.maxFollowers) : undefined,
                city: formData.city,
                country: formData.country
            };

            await api.post('/saved-searches', payload);
            setSearchSaved(true);
            setModalState({
                isOpen: true,
                title: 'Search Saved!',
                message: 'Your search has been saved successfully.',
                type: 'success'
            });
        } catch (err) {
            setModalState({
                isOpen: true,
                title: 'Save Failed',
                message: err.response?.data?.message || 'Failed to save search.',
                type: 'error'
            });
        }
    };

    const handleSaveInfluencer = async (influencer) => {
        try {
            const payload = { influencerIds: [influencer.id] };
            const savePromise = api.post('/saved-influencers/bulk', payload);
            
            setModalState({
                isOpen: true,
                title: 'Influencer Saved!',
                message: `${influencer.fullName} has been added to your collection.`,
                type: 'success'
            });

            await savePromise;
        } catch (err) {
            setModalState({
                isOpen: true,
                title: 'Save Failed',
                message: err.response?.data?.message || 'Failed to save influencer.',
                type: 'error'
            });
        }
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)'
        }}>
            <Navbar />
            
            <div style={{
                flex: 1,
                overflow: 'auto',
                background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
            }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, transparent 100%)',
                    borderBottom: '1px solid var(--border)',
                    padding: '4rem 0 3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}/>
                    
                    <div className="container" style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                marginBottom: '1.5rem'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: 'var(--gold)',
                                    letterSpacing: '0.5px'
                                }}>DISCOVER & CONNECT</span>
                            </div>
                            
                            <h1 style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--gold) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '1rem',
                                letterSpacing: '-1px',
                                lineHeight: '1.1'
                            }}>
                                Find Your Perfect Influencer
                            </h1>
                            <p style={{
                                fontSize: '1.15rem',
                                color: 'var(--text-muted)',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: '1.6'
                            }}>
                                Search through thousands of food creators on YouTube and Instagram
                            </p>
                        </div>

                        {/* Search Card */}
                        <div style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '24px',
                            padding: '3rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.05)',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative corner accent */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }}/>
                            {error && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    marginBottom: '2rem',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    animation: 'slideDown 0.3s ease'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleFetch} style={{ position: 'relative', zIndex: 1 }}>
                                {/* Platform Selector */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <label style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            color: 'var(--text-primary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1.5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                            </svg>
                                            Select Platform
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '14px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, platform: 'youtube' })}
                                            style={{
                                                flex: 1,
                                                padding: '20px 28px',
                                                borderRadius: '16px',
                                                border: formData.platform === 'youtube' ? '2px solid #FF0000' : '2px solid var(--border)',
                                                background: formData.platform === 'youtube' 
                                                    ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.12) 0%, rgba(255, 0, 0, 0.04) 100%)' 
                                                    : 'var(--bg-primary)',
                                                color: formData.platform === 'youtube' ? '#FF0000' : 'var(--text-secondary)',
                                                fontSize: '1.05rem',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transform: formData.platform === 'youtube' ? 'translateY(-3px) scale(1.02)' : 'none',
                                                boxShadow: formData.platform === 'youtube' ? '0 12px 28px rgba(255, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                position: 'relative'
                                            }}
                                        >
                                            {formData.platform === 'youtube' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    width: '24px',
                                                    height: '24px',
                                                    background: '#FF0000',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                </div>
                                            )}
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            <span>YouTube</span>
                                            {formData.platform === 'youtube' && (
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: '#FF0000',
                                                    fontWeight: '600',
                                                    marginTop: '2px'
                                                }}>Selected</span>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, platform: 'instagram' })}
                                            style={{
                                                flex: 1,
                                                padding: '20px 28px',
                                                borderRadius: '16px',
                                                border: formData.platform === 'instagram' ? '2px solid #E4405F' : '2px solid var(--border)',
                                                background: formData.platform === 'instagram' 
                                                    ? 'linear-gradient(135deg, rgba(228, 64, 95, 0.12) 0%, rgba(228, 64, 95, 0.04) 100%)' 
                                                    : 'var(--bg-primary)',
                                                color: formData.platform === 'instagram' ? '#E4405F' : 'var(--text-secondary)',
                                                fontSize: '1.05rem',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transform: formData.platform === 'instagram' ? 'translateY(-3px) scale(1.02)' : 'none',
                                                boxShadow: formData.platform === 'instagram' ? '0 12px 28px rgba(228, 64, 95, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                position: 'relative'
                                            }}
                                        >
                                            {formData.platform === 'instagram' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    width: '24px',
                                                    height: '24px',
                                                    background: '#E4405F',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                </div>
                                            )}
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                            <span>Instagram</span>
                                            {formData.platform === 'instagram' && (
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: '#E4405F',
                                                    fontWeight: '600',
                                                    marginTop: '2px'
                                                }}>Selected</span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%)',
                                    marginBottom: '2.5rem'
                                }}/>

                                {/* Hashtags */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <label style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            color: 'var(--text-primary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1.5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
                                                <line x1="4" y1="9" x2="20" y2="9"/>
                                                <line x1="4" y1="15" x2="20" y2="15"/>
                                                <line x1="10" y1="3" x2="8" y2="21"/>
                                                <line x1="16" y1="3" x2="14" y2="21"/>
                                            </svg>
                                            {formData.platform === 'youtube' ? 'Keywords' : 'Hashtags'}
                                            <span style={{ color: '#ef4444', fontSize: '1rem' }}>*</span>
                                        </label>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder={formData.platform === 'youtube' ? "e.g. food, cooking, recipe" : "e.g. #food, #cooking, #recipe"}
                                            value={formData.hashtags}
                                            onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px 16px 48px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                        <svg 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="var(--text-muted)" 
                                            strokeWidth="2"
                                            style={{
                                                position: 'absolute',
                                                left: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            <line x1="4" y1="9" x2="20" y2="9"/>
                                            <line x1="4" y1="15" x2="20" y2="15"/>
                                            <line x1="10" y1="3" x2="8" y2="21"/>
                                            <line x1="16" y1="3" x2="14" y2="21"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Filters Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '1.25rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>Min Followers</label>
                                        <input
                                            type="number"
                                            placeholder="10,000"
                                            value={formData.minFollowers}
                                            onChange={(e) => setFormData({ ...formData, minFollowers: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>Max Followers</label>
                                        <input
                                            type="number"
                                            placeholder="100,000"
                                            value={formData.maxFollowers}
                                            onChange={(e) => setFormData({ ...formData, maxFollowers: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>City</label>
                                        <input
                                            type="text"
                                            placeholder="Mumbai"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>Country</label>
                                        <input
                                            type="text"
                                            placeholder="IN"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            flex: 1,
                                            padding: '18px 32px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: loading 
                                                ? 'var(--text-muted)' 
                                                : 'linear-gradient(135deg, var(--gold) 0%, #c9a043 100%)',
                                            color: 'var(--bg-primary)',
                                            fontSize: '1.05rem',
                                            fontWeight: '700',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            boxShadow: loading ? 'none' : '0 8px 24px rgba(212, 175, 55, 0.3)',
                                            transform: loading ? 'none' : 'translateY(0)',
                                            letterSpacing: '0.3px'
                                        }}
                                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.4)')}
                                        onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)')}
                                    >
                                        {loading ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                                                    <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round">
                                                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                                                    </path>
                                                </svg>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <circle cx="11" cy="11" r="8"/>
                                                    <path d="m21 21-4.35-4.35"/>
                                                </svg>
                                                Search Influencers
                                            </>
                                        )}
                                    </button>

                                    {results.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleSaveSearch}
                                            disabled={searchSaved}
                                            style={{
                                                padding: '18px 28px',
                                                borderRadius: '12px',
                                                border: '2px solid var(--border)',
                                                background: searchSaved ? 'var(--bg-primary)' : 'transparent',
                                                color: searchSaved ? 'var(--text-muted)' : 'var(--text-primary)',
                                                fontSize: '1.05rem',
                                                fontWeight: '700',
                                                cursor: searchSaved ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={searchSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                            </svg>
                                            {searchSaved ? 'Saved' : 'Save'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1400px' }}>
                        {/* Results Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2.5rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    color: 'var(--text-primary)',
                                    margin: '0 0 0.5rem 0',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Search Results
                                </h2>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'var(--text-muted)',
                                    margin: 0
                                }}>
                                    Found {results.length} {results.length === 1 ? 'influencer' : 'influencers'} matching your criteria
                                </p>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                padding: '12px 24px',
                                borderRadius: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: 'var(--gold)'
                                }}>
                                    {results.length}
                                </span>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                            gap: '1.75rem'
                        }}>
                            {results.map((inf) => (
                                <div
                                    key={inf.id}
                                    onMouseEnter={() => setHoveredCard(inf.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: hoveredCard === inf.id ? '1px solid var(--gold)' : '1px solid var(--border)',
                                        borderRadius: '20px',
                                        padding: '1.75rem',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transform: hoveredCard === inf.id ? 'translateY(-8px)' : 'translateY(0)',
                                        boxShadow: hoveredCard === inf.id 
                                            ? '0 20px 60px rgba(212, 175, 55, 0.15)' 
                                            : '0 4px 12px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    {/* Decorative Gradient */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: inf.platform === 'YOUTUBE' 
                                            ? 'linear-gradient(90deg, #FF0000 0%, #cc0000 100%)' 
                                            : 'linear-gradient(90deg, #E4405F 0%, #c13584 100%)',
                                        opacity: hoveredCard === inf.id ? 1 : 0,
                                        transition: 'opacity 0.3s'
                                    }}/>

                                    {/* Platform Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: inf.platform === 'YOUTUBE' 
                                            ? 'linear-gradient(135deg, #FF0000 0%, #cc0000 100%)' 
                                            : 'linear-gradient(135deg, #E4405F 0%, #c13584 100%)',
                                        color: 'white',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {inf.platform === 'YOUTUBE' ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        )}
                                        {inf.platform}
                                    </div>

                                    {/* Profile Info */}
                                    <div style={{ marginBottom: '1.5rem', paddingRight: '100px' }}>
                                        <h3 style={{
                                            fontSize: '1.4rem',
                                            fontWeight: '800',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.5rem',
                                            lineHeight: '1.2',
                                            letterSpacing: '-0.3px'
                                        }}>
                                            {inf.fullName}
                                        </h3>
                                        <p style={{
                                            fontSize: '1rem',
                                            color: 'var(--text-muted)',
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                                <circle cx="9" cy="7" r="4"/>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                            </svg>
                                            @{inf.username}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1rem',
                                        marginBottom: '1.5rem',
                                        padding: '1.25rem',
                                        background: 'linear-gradient(135deg, var(--bg-primary) 0%, rgba(212, 175, 55, 0.02) 100%)',
                                        borderRadius: '14px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div>
                                            <p style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)',
                                                marginBottom: '0.5rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                fontWeight: '700'
                                            }}>Followers</p>
                                            <p style={{
                                                fontSize: '1.75rem',
                                                fontWeight: '800',
                                                background: 'linear-gradient(135deg, var(--gold) 0%, #c9a043 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                margin: 0,
                                                letterSpacing: '-0.5px'
                                            }}>
                                                {formatNumber(inf.followerCount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)',
                                                marginBottom: '0.5rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                fontWeight: '700'
                                            }}>Posts</p>
                                            <p style={{
                                                fontSize: '1.75rem',
                                                fontWeight: '800',
                                                color: 'var(--text-primary)',
                                                margin: 0,
                                                letterSpacing: '-0.5px'
                                            }}>
                                                {formatNumber(inf.postsCount || 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.7',
                                        marginBottom: '1.5rem',
                                        minHeight: '65px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {inf.bio || 'No bio available'}
                                    </p>

                                    {/* Save Button */}
                                    <button
                                        onClick={() => handleSaveInfluencer(inf)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: hoveredCard === inf.id 
                                                ? 'linear-gradient(135deg, var(--gold) 0%, #c9a043 100%)' 
                                                : 'var(--bg-primary)',
                                            color: hoveredCard === inf.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                                            fontSize: '0.95rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            border: hoveredCard === inf.id ? 'none' : '2px solid var(--border)',
                                            boxShadow: hoveredCard === inf.id ? '0 8px 20px rgba(212, 175, 55, 0.3)' : 'none',
                                            letterSpacing: '0.3px'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                        </svg>
                                        Save Influencer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && results.length === 0 && formData.hashtags && (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem'
                        }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.75rem'
                        }}>No Results Found</h3>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.6'
                        }}>
                            Try adjusting your search criteria or filters to find more influencers
                        </p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />
        </div>
    );
};

export default FetchInfluencers;
