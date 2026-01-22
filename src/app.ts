import express from 'express';
import cors from 'cors';

import authRoutes from './api/routes/auth.routes';
import savedSearchRoutes from './api/routes/savedSearch.routes';
import savedInfluencerRoutes from './api/routes/savedInfluencer.routes';
import influencerRoutes from './api/routes/influencers.routes';

const app = express();

/* 🔥 REQUIRED BODY PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

/* 🔥 ROUTES (AFTER body parsers) */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/influencers', influencerRoutes);
app.use('/api/v1/saved-searches', savedSearchRoutes);
app.use('/api/v1/saved-influencers', savedInfluencerRoutes);

/* HEALTH CHECK */
app.get('/health', (_req: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
});

export default app;