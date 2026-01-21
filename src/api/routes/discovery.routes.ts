import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as discoveryController from '../controllers/discovery.controller';

const router = Router();

/**
 * Rate limiting: 30 requests per 15 minutes for discovery triggers
 */
const discoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        status: 'fail',
        message: 'Too many discovery requests, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @route POST /api/v1/discovery/instagram
 * @desc Trigger background discovery job for Instagram
 * @access Public (Internal for Phase 4)
 */
router.post('/instagram', discoveryLimiter, discoveryController.triggerInstagramDiscovery);

export default router;
