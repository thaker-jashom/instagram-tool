import { Request, Response, NextFunction } from 'express';
import { searchInfluencersService } from '../services/search.service';
import { sendResponse } from '../../utils/httpResponse';
import { getOrSet, generateCacheKey } from '../../utils/cache';

export const searchInfluencers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cacheKey = generateCacheKey('search:influencers', req.body);
        let fromCache = true;

        const results = await getOrSet(cacheKey, 60, async () => {
            fromCache = false;
            return await searchInfluencersService(req.body);
        });

        return sendResponse(
            res,
            200,
            results,
            fromCache
                ? 'Influencers fetched successfully (from cache)'
                : 'Influencers fetched successfully'
        );
    } catch (error) {
        next(error);
    }
};