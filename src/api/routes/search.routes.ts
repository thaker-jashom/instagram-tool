import { Router } from 'express';
import { searchInfluencers } from '../controllers/search.controller';
import { validate } from '../middleware/validation.middleware';
import { searchSchema } from '../validators/search.validator';

const router = Router();

router.post(
  '/influencers',
  validate(searchSchema),
  searchInfluencers
);

export default router;