import { Request, Response } from 'express';
import { fetchInstagramInfluencers } from '../../services/instagramFetch.service';
import { fetchYoutubeInfluencers } from '../../services/youtubeFetch.service';
import logger from '../../utils/logger';

export const instagramFetchController = async (
  req: Request,
  res: Response
) => {
  try {
    const { platform = 'youtube' } = req.body;

    let influencers: any[] = [];

    if (platform === 'instagram') {
      try {
        logger.info('Fetching Instagram influencers');
        influencers = await fetchInstagramInfluencers(req.body);
      } catch (err: any) {
        logger.error('Instagram fetch failed', err.message);
      }
    }

    if (platform === 'youtube') {
      try {
        logger.info('Fetching YouTube influencers');
        influencers = await fetchYoutubeInfluencers(req.body);
      } catch (err: any) {
        logger.error('YouTube fetch failed', err.message);
      }
    }

    return res.status(200).json({
      status: 'success',
      platform,
      data: {
        influencers: influencers || [],
      },
    });
  } catch (error: any) {
    logger.error('Discovery API failed', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Discovery failed',
    });
  }
};