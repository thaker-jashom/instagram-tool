import { Worker, Job } from 'bullmq';
import { PrismaClient, Platform } from '@prisma/client';
import { queueConfig } from '../../config/queue';
import { YouTubeAdapter } from '../../adapters/youtube.adapter';
import logger from '../../utils/logger';
import { YouTubeDiscoveryJob } from '../youtube.queue';

const prisma = new PrismaClient();

if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is missing');
}

const youtubeAdapter = new YouTubeAdapter(process.env.YOUTUBE_API_KEY);

export const youtubeWorker = new Worker<YouTubeDiscoveryJob>(
    'youtube-discovery',
    async (job: Job<YouTubeDiscoveryJob>) => {
        const { location, keywords } = job.data;

        logger.info(
            `YouTube discovery started | location=${location} | keywords=${keywords.join(
                ', '
            )}`
        );

        const channels = await youtubeAdapter.searchFoodChannels(
            location,
            keywords
        );

        for (const channel of channels) {
            await prisma.influencer.upsert({
                where: {
                    platform_externalUserId: {
                        platform: Platform.YOUTUBE,
                        externalUserId: channel.platformUserId,
                    },
                },
                update: {
                    followerCount: channel.subscriberCount,
                    engagementRate: channel.qualityScore,
                    bio: channel.description,
                    profilePicUrl: channel.profileImageUrl,
                },
                create: {
                    platform: Platform.YOUTUBE,
                    externalUserId: channel.platformUserId,
                    username: channel.username ?? channel.platformUserId,
                    fullName: channel.displayName,
                    bio: channel.description,
                    followerCount: channel.subscriberCount,
                    engagementRate: channel.qualityScore,
                    profilePicUrl: channel.profileImageUrl,
                    locationCity: location,
                    locationCountry: 'IN',
                },
            });
        }
    },
    {
        connection: queueConfig,
    }
);
