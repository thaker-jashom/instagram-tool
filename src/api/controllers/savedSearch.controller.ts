import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

/**
 * POST /api/v1/saved-searches
 */
export const createSavedSearch = async (
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

        const {
            hashtags,
            minFollowers,
            maxFollowers,
            city,
            country
        } = req.body;

        if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one hashtag is required'
            });
        }

        const savedSearch = await prisma.savedSearch.create({
            data: {
                userId,
                hashtags,
                minFollowers,
                maxFollowers,
                city,
                country
            }
        });

        return res.status(201).json({
            status: 'success',
            data: savedSearch
        });
    } catch (error) {
        logger.error('Failed to create saved search', error);

        return res.status(500).json({
            status: 'error',
            message: 'Failed to save search'
        });
    }
};

/**
 * GET /api/v1/saved-searches
 */
export const getSavedSearches = async (
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

        const searches = await prisma.savedSearch.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            status: 'success',
            data: searches
        });
    } catch (error) {
        logger.error('Failed to fetch saved searches', error);

        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch saved searches'
        });
    }
};