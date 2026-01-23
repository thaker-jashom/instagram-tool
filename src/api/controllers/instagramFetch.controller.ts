import { Request, Response } from 'express';
import { fetchInstagramInfluencersViaApify } from '../../services/apifyInstagram.service';
import logger from '../../utils/logger';

export const instagramFetchController = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as {
      hashtag?: string;
      limit?: number;
    };

    const hashtag = body.hashtag || '';
    const limit = body.limit ?? 50;

    logger.info('Fetching Instagram influencers via Apify');

    const influencers = await fetchInstagramInfluencersViaApify({
        hashtags: hashtag ? [hashtag] : [],
        limit,
      });

    return res.status(200).json({
      status: 'success',
      platform: 'instagram',
      data: {
        influencers: influencers ?? [],
      },
    });
  } catch (error: any) {
    logger.error({
      message: 'Instagram Apify fetch failed',
      error: error?.message || error,
    });

    return res.status(200).json({
      status: 'success',
      platform: 'instagram',
      data: {
        influencers: [],
      },
    });
  }
};