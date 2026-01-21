import { Request, Response, NextFunction } from 'express';
import { fetchInstagramInfluencers } from '../../services/instagramFetch.service';
import { fetchYoutubeInfluencers } from '../../services/youtubeFetch.service';
import logger from '../../utils/logger';

export const instagramFetchController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const influencers: any[] = [];

        // 1. Fetch Instagram (Graceful Fail)
        try {
            const instagramResults = await fetchInstagramInfluencers(req.body);
            if (instagramResults) {
                influencers.push(...instagramResults);
            }
        } catch (error: any) {
            logger.error('Instagram fetch failed (continuing to YouTube):', error.message);
        }

        // 2. Fetch YouTube (Graceful Fail)
        try {
            const youtubeResults = await fetchYoutubeInfluencers(req.body);
            if (youtubeResults) {
                influencers.push(...youtubeResults);
            }
        } catch (error: any) {
            logger.error('YouTube fetch failed:', error.message);
        }

        // 3. Unified Filtering (Standardize Follower Range)
        const { minFollowers, maxFollowers } = req.body;
        const min = minFollowers ? Number(minFollowers) : 0;
        const max = maxFollowers ? Number(maxFollowers) : Infinity;

        const filteredInfluencers = influencers.filter(inf => {
            const count = Number(inf.followerCount || 0);
            return count >= min && count <= max;
        });

        res.status(200).json({
            status: 'success',
            platform: 'mixed',
            data: { influencers: filteredInfluencers }
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: 'Discovery API request failed',
            reason: error.message || 'Unknown error'
        });
    }
};
