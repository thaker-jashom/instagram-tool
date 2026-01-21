import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const SavedInfluencers = () => {
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInfluencers();
    }, []);

    const fetchInfluencers = async () => {
        try {
            const response = await api.get('/saved-influencers');
            // Adjust according to actual API response structure if needed
            // Prompt says: GET /api/v1/saved-influencers
            setInfluencers(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch saved influencers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h2>Saved Influencers</h2>
                {error && <div className="error-message">{error}</div>}
                {loading ? <p>Loading...</p> : (
                    <div className="card" style={{ overflowX: 'auto' }}>
                        {influencers.length === 0 ? <p>No saved influencers found.</p> : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th>User</th>
                                        <th>Stats</th>
                                        <th>Bio</th>
                                        <th>Saved Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {influencers.map((inf) => (
                                        <tr key={inf.id}>
                                            <td>{inf.platform}</td>
                                            <td>
                                                <strong>{inf.fullName}</strong><br />
                                                @{inf.username}
                                            </td>
                                            <td>
                                                Followers: {inf.followerCount}<br />
                                                Posts: {inf.postsCount}
                                            </td>
                                            <td style={{ maxWidth: '300px' }}>
                                                {inf.bio ? (inf.bio.length > 50 ? inf.bio.substring(0, 50) + '...' : inf.bio) : '-'}
                                            </td>
                                            <td>{new Date(inf.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SavedInfluencers;
