import { Router } from 'express';
import {
    createSavedSearch,
    getSavedSearches
} from '../controllers/savedSearch.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createSavedSearch);
router.get('/', authenticate, getSavedSearches);

export default router;