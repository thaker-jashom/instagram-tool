import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { saveInfluencersBulk, getSavedInfluencers } from '../controllers/savedInfluencer.controller';

const router = Router();

router.post('/bulk', authenticate, saveInfluencersBulk);
router.get('/', authenticate, getSavedInfluencers);

export default router;