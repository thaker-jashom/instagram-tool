import { Router } from 'express';
import { youtubeFetchController } from '../controllers/youtubeFetch.controller';
import { validate } from '../middleware/validate';
import { instagramFetchValidator } from '../validators/instagramFetch.validator'; // Re-using validator as fields are similar

const router = Router();

router.post(
    '/fetch',
    validate(instagramFetchValidator),
    youtubeFetchController
);

export default router;
