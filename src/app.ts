import express from 'express';
import cors from 'cors';

import authRoutes from './api/routes/auth.routes';
import savedSearchRoutes from './api/routes/savedSearch.routes';
import savedInfluencerRoutes from './api/routes/savedInfluencer.routes';
import influencerRoutes from './api/routes/influencers.routes';
import instagramFetchRoutes from './api/routes/instagramFetch.routes';
import youtubeFetchRoutes from './api/routes/youtubeFetch.routes';

const app = express();

/* CORS Configuration - MUST BE BEFORE BODY PARSERS */
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://instagram-tool-mocha.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl, etc.)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel preview deployments
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Temporarily allow all for debugging
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

/* Handle preflight requests explicitly */
app.options('*', cors());

/* 🔥 REQUIRED BODY PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

/* Global Error Handler */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

export default app;