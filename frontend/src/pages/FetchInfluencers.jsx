import React, { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const FetchInfluencers = () => {
    const [formData, setFormData] = useState({
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

    // Parse hashtags from string (space or comma separated)
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
                hashtags: getHashtagsArray(formData.hashtags),
                minFollowers: formData.minFollowers ? parseInt(formData.minFollowers) : undefined,
                maxFollowers: formData.maxFollowers ? parseInt(formData.maxFollowers) : undefined,
                location: {
                    city: formData.city,
                    country: formData.country
                }
            };

            console.log('Fetch Payload:', payload);

            const response = await api.post('/influencers/fetch', payload);
            console.log('Fetch Response:', response.data);

            setResults(response.data.data.influencers || []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.response?.data?.message || 'Failed to fetch influencers');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSearch = async () => {
        try {
            // Backend expects flat structure, not nested location object
            const payload = {
                hashtags: getHashtagsArray(formData.hashtags),
                minFollowers: formData.minFollowers ? parseInt(formData.minFollowers) : undefined,
                maxFollowers: formData.maxFollowers ? parseInt(formData.maxFollowers) : undefined,
                city: formData.city,
                country: formData.country
            };

            console.log('Save Search Payload:', payload);
            await api.post('/saved-searches', payload);
            setSearchSaved(true);
            alert('Search saved successfully');
        } catch (err) {
            console.error('Save Search Error:', err);
            setError(err.response?.data?.message || 'Failed to save search');
        }
    };

    const handleSaveInfluencer = async (influencer) => {
        try {
            console.log('Saving Influencer:', influencer);
            // Backend expects { influencerIds: [uuid] }
            // Assuming influencer object has 'id'. If not, we might need platform_user_id mapped?
            // "Send selected influencer data exactly as returned" logic vs Backend Contract conflict.
            // Following Backend Contract of savedInfluencer.controller.ts which expects influencerIds.

            const payload = {
                influencerIds: [influencer.id]
            };

            await api.post('/saved-influencers/bulk', payload);
            alert('Influencer saved successfully');
        } catch (err) {
            console.error('Save Influencer Error:', err);
            alert(err.response?.data?.message || 'Failed to save influencer');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2>Find Influencers</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleFetch}>
                        <div className="form-group">
                            <label>Hashtags (required)</label>
                            <input
                                type="text"
                                placeholder="e.g. #food, #mumbai"
                                value={formData.hashtags}
                                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Min Followers</label>
                                <input
                                    type="number"
                                    value={formData.minFollowers}
                                    onChange={(e) => setFormData({ ...formData, minFollowers: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Max Followers</label>
                                <input
                                    type="number"
                                    value={formData.maxFollowers}
                                    onChange={(e) => setFormData({ ...formData, maxFollowers: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Country Code</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>

                        {results.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSaveSearch}
                                className="btn-primary"
                                style={{ marginLeft: '10px', backgroundColor: '#10b981' }}
                                disabled={searchSaved}
                            >
                                {searchSaved ? 'Search Saved' : 'Save Search'}
                            </button>
                        )}
                    </form>
                </div>

                {results.length > 0 && (
                    <div className="results-section">
                        <h3>Results ({results.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {results.map((inf) => (
                                <div key={inf.id} className="card">
                                    <h4>{inf.fullName} (@{inf.username})</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{inf.platform}</p>
                                    <div style={{ margin: '10px 0' }}>
                                        <strong>Followers:</strong> {inf.followerCount}<br />
                                        <strong>Posts:</strong> {inf.postsCount}
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                                        {inf.bio ? (inf.bio.length > 100 ? inf.bio.substring(0, 100) + '...' : inf.bio) : 'No bio'}
                                    </p>
                                    <button
                                        onClick={() => handleSaveInfluencer(inf)}
                                        className="btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        Save Influencer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FetchInfluencers;
