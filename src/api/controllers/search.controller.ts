import { Request, Response, NextFunction } from 'express';
import { searchInfluencersService } from '../services/search.service';
import { sendResponse } from '../../utils/httpResponse';

export const searchInfluencers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const results = await searchInfluencersService(req.body);

        return sendResponse(
            res,
            200,
            results,
            'Influencers fetched successfully'
        );
    } catch (error) {
        next(error);
    }
};