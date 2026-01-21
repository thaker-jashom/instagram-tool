import prisma from '../../config/prisma';
import { Platform } from '@prisma/client';

export const searchInfluencersService = async (filters: any) => {
    const {
        platform,
        location,
        minFollowers,
        maxFollowers,
        keyword,
        sortBy,
        sortOrder = 'desc',
        cursor,
        limit = 20,
    } = filters;

    const where: any = {};

    if (platform) {
        where.platform = platform;
    }

    // Location filter
    if (location) {
        where.OR = [
            ...(where.OR || []),
            { locationCity: { contains: location, mode: 'insensitive' } },
            { locationState: { contains: location, mode: 'insensitive' } },
            { locationCountry: { contains: location, mode: 'insensitive' } },
        ];
    }

    // Follower range filter
    if (minFollowers !== undefined || maxFollowers !== undefined) {
        where.followerCount = {};
        if (minFollowers !== undefined) {
            where.followerCount.gte = Number(minFollowers);
        }
        if (maxFollowers !== undefined) {
            where.followerCount.lte = Number(maxFollowers);
        }
    }

    // Keyword search (username / fullName / bio)
    if (keyword) {
        if (!where.OR) where.OR = [];
        where.OR.push(
            { username: { contains: keyword, mode: 'insensitive' } },
            { fullName: { contains: keyword, mode: 'insensitive' } },
            { bio: { contains: keyword, mode: 'insensitive' } }
        );
    }

    // Sorting
    const orderBy: any = [];
    if (sortBy === 'followers') {
        orderBy.push({ followerCount: sortOrder });
    } else if (sortBy === 'engagement') {
        orderBy.push({ engagementRate: sortOrder });
    } else if (sortBy === 'quality_score') {
        orderBy.push({ qualityScore: sortOrder });
    }

    // Always include a stable sort for cursor pagination
    orderBy.push({ createdAt: 'desc' });
    orderBy.push({ id: 'asc' });

    // Query Building
    const query: any = {
        where,
        take: Number(limit),
        orderBy,
        select: {
            id: true,
            username: true,
            fullName: true,
            bio: true,
            locationCity: true,
            locationState: true,
            locationCountry: true,
            platform: true,
            followerCount: true,
            engagementRate: true,
            profilePicUrl: true,
            qualityScore: true,
            createdAt: true,
        },
    };


    // Cursor Pagination
    if (cursor) {
        query.skip = 1;
        query.cursor = { id: cursor };
    }

    return prisma.influencer.findMany(query);
};