import { Request, Response, NextFunction } from 'express';
import { sendError } from '../../utils/httpResponse';
import logger from '../../utils/logger';

/**
 * Trigger Instagram discovery job
 * POST /api/v1/discovery/instagram
 * NOTE: Queue functionality removed - Redis not required by HR document
 */
export const triggerInstagramDiscovery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logger.warn('Instagram discovery endpoint called but queues are disabled');
        return sendError(res, 503, 'Discovery feature is currently unavailable (queues disabled)');
    } catch (error) {
        logger.error('Failed to trigger Instagram discovery:', error);
        next(error);
    }
};
