import express from 'express';
import cors from 'cors';

import authRoutes from './api/routes/auth.routes';
import savedSearchRoutes from './api/routes/savedSearch.routes';
import savedInfluencerRoutes from './api/routes/savedInfluencer.routes';
import influencerRoutes from './api/routes/influencers.routes';
import instagramFetchRoutes from './api/routes/instagramFetch.routes';
import youtubeFetchRoutes from './api/routes/youtubeFetch.routes';

const app = express();

/* 🔥 REQUIRED BODY PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/influencers', influencerRoutes);
app.use('/api/v1/saved-searches', savedSearchRoutes);
app.use('/api/v1/saved-influencers', savedInfluencerRoutes);
app.use('/api/v1/instagram', instagramFetchRoutes);
app.use('/api/v1/youtube', youtubeFetchRoutes);

/* ROOT ROUTE */
app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({
        status: 'ok',
        message: 'Food Influencer API is running',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/v1/auth',
            influencers: '/api/v1/influencers',
            savedSearches: '/api/v1/saved-searches',
            savedInfluencers: '/api/v1/saved-influencers',
            instagram: '/api/v1/instagram',
            youtube: '/api/v1/youtube'
        }
    });
});

/* HEALTH CHECK */
app.get('/health', (_req: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
});

export default app;