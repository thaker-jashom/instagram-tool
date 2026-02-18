import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { saveInfluencersBulk, getSavedInfluencers, deleteSavedInfluencer } from '../controllers/savedInfluencer.controller';

const router = Router();

router.post('/bulk', authenticate, saveInfluencersBulk);
router.get('/', authenticate, getSavedInfluencers);
router.delete('/:influencerId', authenticate, deleteSavedInfluencer);

export default router;