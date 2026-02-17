import { Request, Response } from 'express';
import { fetchInstagramInfluencers } from '../../services/instagramFetch.service';
import logger from '../../utils/logger';

export const instagramFetchController = async (
  req: Request,
  res: Response
) => {
  try {
    logger.info('Fetching Instagram influencers via RapidAPI', req.body);
    let influencers: any[] = [];

    try {
      influencers = await fetchInstagramInfluencers(req.body);
    } catch (err: any) {
      logger.error('Instagram fetch via Apify failed', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'Instagram fetch failed: ' + err.message,
      });
    }

    // Apply follower filtering after fetch (additional safety check)
    const min = Number(req.body.minFollowers || 0);
    const max = Number(req.body.maxFollowers || Infinity);

    influencers = influencers.filter((i: any) =>
      Number(i.followerCount || 0) >= min &&
      Number(i.followerCount || 0) <= max
    );

    // Return response in required structure
    return res.status(200).json({
      status: 'success',
      platform: 'instagram',
      data: {
        influencers
      },
    });
  } catch (error: any) {
    logger.error('Instagram Discovery API failed', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Discovery failed',
    });
  }
};