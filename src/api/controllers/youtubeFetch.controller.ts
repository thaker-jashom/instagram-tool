import { Request, Response } from 'express';
import { fetchYoutubeInfluencers } from '../../services/youtubeFetch.service';
import logger from '../../utils/logger';

export const youtubeFetchController = async (
    req: Request,
    res: Response
) => {
    try {
        logger.info('Fetching YouTube influencers', req.body);
        let influencers: any[] = [];

        try {
            influencers = await fetchYoutubeInfluencers(req.body);
        } catch (err: any) {
            logger.error('YouTube fetch failed', err.message);
            return res.status(500).json({
                status: 'error',
                message: 'YouTube fetch failed: ' + err.message,
            });
        }

        // Apply follower filtering after fetch
        const min = Number(req.body.minFollowers || 0);
        const max = Number(req.body.maxFollowers || Infinity);

        influencers = influencers.filter((i: any) =>
            Number(i.followerCount || 0) >= min &&
            Number(i.followerCount || 0) <= max
        );

        // Return response in required structure
        return res.status(200).json({
            status: 'success',
            platform: 'youtube',
            data: {
                influencers
            },
        });
    } catch (error: any) {
        logger.error('YouTube Discovery API failed', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Discovery failed',
        });
    }
};
