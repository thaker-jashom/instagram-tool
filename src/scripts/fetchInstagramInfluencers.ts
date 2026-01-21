import prisma from '../config/prisma';
import logger from '../utils/logger';
import { instagramAdapter } from '../adapters/instagram.adapter';

// List of hashtags to search
const HASHTAGS = [
    'foodie',
    'indianfood',
    'streetfood',
    'mumbaifood',
    'delhifood',
    'foodblogger',
    'foodstagram',
    'instafood',
    'foodlover',
    'foodphotography',
];

async function fetchInstagramInfluencers() {
    logger.info('Starting Instagram influencer fetch job...');

    let totalSaved = 0;
    const TARGET_COUNT = 100;

    for (const hashtag of HASHTAGS) {
        if (totalSaved >= TARGET_COUNT) break;

        logger.info(`Searching hashtag: #${hashtag}`);
        try {
            const results = await instagramAdapter.searchByHashtag(hashtag);

            if (!Array.isArray(results) || results.length === 0) {
                logger.warn(`No results for #${hashtag}`);
                continue;
            }

            // Shuffle results to avoid getting same top users every time
            const shuffled = results.sort(() => 0.5 - Math.random());

            for (const username of shuffled) {
                if (totalSaved >= TARGET_COUNT) break;

                if (!username) continue;

                // Check if exists
                const existing = await prisma.influencer.findUnique({
                    where: { platform_externalUserId: { platform: 'INSTAGRAM', externalUserId: username } }, // Assuming username is externalUserId for now or we query by username
                });

                // Wait: the schema has specific constraints.
                // Let's check if username exists anywhere
                const existingUser = await prisma.influencer.findFirst({
                    where: {
                        username: username,
                        platform: 'INSTAGRAM',
                    }
                });

                if (existingUser) {
                    logger.info(`Skipping existing user: ${username}`);
                    continue;
                }

                try {
                    // Fetch full profile details
                    const profile = await instagramAdapter.getProfile(username);

                    if (profile.followers < 100) {
                        logger.info(`Skipping micro-user: ${username} (${profile.followers} followers)`);
                        continue;
                    }

                    // Save to DB
                    await prisma.influencer.create({
                        data: {
                            username: profile.username,
                            fullName: profile.fullName || profile.username,
                            platform: 'INSTAGRAM',
                            externalUserId: profile.username, // Using username as ID since API might not give numeric ID safely
                            followerCount: profile.followers,
                            engagementRate: profile.engagementRate,
                            followingCount: profile.following,
                            postsCount: profile.posts,
                            profilePicUrl: `https://instagram.com/${profile.username}/profilepic`, // Placeholder or real if available
                            bio: `Discovered via #${hashtag}`,
                            locationCountry: 'IN', // Defaulting to IN for this campaign
                        },
                    });

                    logger.info(`✅ Saved: ${profile.username}`);
                    totalSaved++;
                } catch (err) {
                    logger.error(`Failed to process user ${username}`, err);
                }

                // Sleep to be nice to API
                await new Promise((r) => setTimeout(r, 1000));
            }
        } catch (err) {
            logger.error(`Error searching #${hashtag}`, err);
        }
    }

    logger.info(`🎉 Fetch job completed. Total new influencers saved: ${totalSaved}`);
}

fetchInstagramInfluencers()
    .catch((err) => {
        logger.error('❌ Job failed', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
