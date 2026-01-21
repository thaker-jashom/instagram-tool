import { Request, Response, NextFunction } from 'express';
import { youtubeDiscoveryQueue } from '../../queues/youtube.queue';

export const startYouTubeDiscovery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { location, keywords } = req.body;

    const job = await youtubeDiscoveryQueue.add('discover', {
      location,
      keywords,
    });

    return res.status(200).json({
      status: 'success',
      message: 'YouTube discovery job queued',
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
};