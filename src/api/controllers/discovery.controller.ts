import { Request, Response, NextFunction } from 'express';
import { instagramQueue } from '../../queues/instagram.queue';
import { sendResponse, sendError } from '../../utils/httpResponse';
import logger from '../../utils/logger';

/**
 * Trigger Instagram discovery job
 * POST /api/v1/discovery/instagram
 */
export const triggerInstagramDiscovery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { hashtags, usernames, location } = req.body;

        // 1️⃣ Basic validation
        if ((!hashtags || hashtags.length === 0) && (!usernames || usernames.length === 0)) {
            return sendError(res, 400, 'Either hashtags or usernames must be provided');
        }

        // 2️⃣ Queue the job
        const job = await instagramQueue.add('instagram-discovery', {
            hashtags,
            usernames,
            location
        });

        logger.info(`Instagram discovery job queued: ${job.id}`);

        // 3️⃣ Respond with 202 Accepted
        return sendResponse(res, 202, { jobId: job.id }, 'Instagram discovery job queued successfully');

    } catch (error) {
        logger.error('Failed to trigger Instagram discovery:', error);
        next(error);
    }
};
