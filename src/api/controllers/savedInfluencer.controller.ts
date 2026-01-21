import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/v1/saved-influencers/bulk
 */
export const saveInfluencersBulk = async (
  req: Request & { user?: { userId: string } },
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { influencerIds } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    if (!Array.isArray(influencerIds) || influencerIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'influencerIds must be a non-empty array'
      });
    }

    const data = influencerIds.map((influencerId: string) => ({
      userId,
      influencerId
    }));

    const result = await prisma.savedInfluencer.createMany({
      data,
      skipDuplicates: true
    });

    return res.status(201).json({
      status: 'success',
      savedCount: result.count
    });
  } catch (error) {
    console.error('saveInfluencersBulk error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to save influencers'
    });
  }
};

/**
 * GET /api/v1/saved-influencers
 */
export const getSavedInfluencers = async (
  req: Request & { user?: { userId: string } },
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const savedInfluencers = await prisma.savedInfluencer.findMany({
      where: { userId },
      include: {
        influencer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      status: 'success',
      data: savedInfluencers.map(item => item.influencer)
    });
  } catch (error) {
    console.error('getSavedInfluencers error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch saved influencers'
    });
  }
};