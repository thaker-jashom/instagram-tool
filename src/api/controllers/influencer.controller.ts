import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import { sendResponse } from '../../utils/httpResponse';

export const getInfluencers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const influencers = await prisma.influencer.findMany({
      skip,
      take: limit,
      orderBy: { followerCount: 'desc' },
    });

    return sendResponse(res, 200, influencers, 'Influencers fetched');
  } catch (error) {
    next(error);
  }
};

export const getInfluencerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const influencer = await prisma.influencer.findUnique({
      where: { id },
    });

    if (!influencer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Influencer not found',
      });
    }

    return sendResponse(res, 200, influencer, 'Influencer fetched');
  } catch (error) {
    next(error);
  }
};