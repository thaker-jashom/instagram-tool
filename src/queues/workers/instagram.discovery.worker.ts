import { Worker, Job } from 'bullmq';
import { PrismaClient, Platform } from '@prisma/client';
import { queueConfig } from '../../config/queue';
import { discoveryService } from '../../services/discovery.service';
import logger from '../../utils/logger';
import { InstagramDiscoveryJob } from '../instagram.queue';

const prisma = new PrismaClient();

export const instagramWorker = new Worker<InstagramDiscoveryJob>(
    'instagram-discovery',
    async (job: Job<InstagramDiscoveryJob>) => {
        const { hashtags, usernames, location } = job.data;

        logger.info(
            `Instagram discovery started | hashtags=${hashtags?.join(', ') || 'none'} | usernames=${usernames?.join(', ') || 'none'} | location=${location || 'none'}`
        );

        try {
            // 1️⃣ Discover Instagram profiles
            const results = await discoveryService.discoverInstagram({
                hashtags,
                usernames,
                location
            });

            // 2️⃣ Flatten results to get all profiles
            const profiles = discoveryService.flattenResults(results);

            logger.info(`Found ${profiles.length} Instagram profiles to process`);

            // 3️⃣ Upsert each profile to database
            for (const profile of profiles) {
                try {
                    await prisma.influencer.upsert({
                        where: {
                            platform_externalUserId: {
                                platform: Platform.INSTAGRAM,
                                externalUserId: profile.username,
                            },
                        },
                        update: {
                            fullName: profile.fullName || undefined,
                            followerCount: profile.followers,
                            engagementRate: profile.engagementRate,
                        },
                        create: {
                            platform: Platform.INSTAGRAM,
                            externalUserId: profile.username,
                            username: profile.username,
                            fullName: profile.fullName || profile.username,
                            followerCount: profile.followers,
                            engagementRate: profile.engagementRate ?? null,
                            locationCity: location || null,
                            locationCountry: 'IN',
                        },
                    });

                    logger.info(`Upserted Instagram influencer: ${profile.username}`);
                } catch (dbError) {
                    logger.error(`Failed to upsert influencer ${profile.username}:`, dbError);
                    // Continue with other profiles
                }
            }

            logger.info(`Instagram discovery job ${job.id} completed successfully`);
        } catch (error) {
            logger.error(`Instagram discovery job ${job.id} failed:`, error);
            // Don't throw - let the job complete with error logged
        }
    },
    {
        connection: queueConfig,
    }
);

// Handle worker events
instagramWorker.on('completed', (job) => {
    logger.info(`Instagram discovery job ${job.id} completed`);
});

instagramWorker.on('failed', (job, err) => {
    logger.error(`Instagram discovery job ${job?.id} failed:`, err);
});
