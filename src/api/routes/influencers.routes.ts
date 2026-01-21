import { Router } from 'express';
import {
  getInfluencers,
  getInfluencerById,
} from '../controllers/influencer.controller';
import { instagramFetchController } from '../controllers/instagramFetch.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { instagramFetchValidator } from '../validators/instagramFetch.validator';

const router = Router();

// GET /api/v1/influencers?page=1&limit=5
router.get('/', getInfluencers);

// POST /api/v1/influencers/fetch
router.post(
  '/fetch',
  authenticate,
  validate(instagramFetchValidator),
  instagramFetchController
);

// GET /api/v1/influencers/:id
router.get('/:id', getInfluencerById);

export default router;