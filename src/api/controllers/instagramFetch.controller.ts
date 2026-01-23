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
        const { platform = 'instagram' } = req.body;

        // Fetch based on selected platform
        if (platform === 'instagram') {
            try {
                const instagramResults = await fetchInstagramInfluencers(req.body);
                if (Array.isArray(instagramResults)) {
                    influencers.push(
                        ...instagramResults.map((inf) => ({
                            ...inf,
                            platform: 'instagram'
                        }))
                    );
                }
            } catch (error: any) {
                logger.error('Instagram fetch failed:', error.message);
            }
        } else if (platform === 'youtube') {
            try {
                const youtubeResults = await fetchYoutubeInfluencers(req.body);
                if (Array.isArray(youtubeResults)) {
                    influencers.push(
                        ...youtubeResults.map((inf) => ({
                            ...inf,
                            platform: 'youtube'
                        }))
                    );
                }
            } catch (error: any) {
                logger.error('YouTube fetch failed:', error.message);
            }
        }

        // Unified follower filtering
        const { minFollowers, maxFollowers } = req.body;
        const min = minFollowers ? Number(minFollowers) : 0;
        const max = maxFollowers ? Number(maxFollowers) : Infinity;

        const filteredInfluencers = influencers.filter((inf) => {
            const count = Number(inf.followerCount || 0);
            return count >= min && count <= max;
        });

        return res.status(200).json({
            status: 'success',
            platform: platform,
            data: {
                influencers: filteredInfluencers
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: 'Discovery request failed',
            reason: error.message || 'Unknown error'
        });
    }
};