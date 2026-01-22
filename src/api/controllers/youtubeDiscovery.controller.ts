import { Request, Response, NextFunction } from 'express';

/**
 * NOTE: Queue functionality removed - Redis not required by HR document
 */
export const startYouTubeDiscovery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(503).json({
      status: 'error',
      message: 'Discovery feature is currently unavailable (queues disabled)',
    });
  } catch (error) {
    next(error);
  }
};