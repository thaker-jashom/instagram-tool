import { Router } from 'express';
import { instagramFetchController } from '../controllers/instagramFetch.controller';
import { validate } from '../middleware/validate';
import { instagramFetchValidator } from '../validators/instagramFetch.validator';

const router = Router();

router.post(
    '/fetch',
    validate(instagramFetchValidator),
    instagramFetchController
);

export default router;