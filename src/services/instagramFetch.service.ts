import { instagramAdapter } from '../adapters/instagram.adapter';
import { influencerService } from './influencer.service';
import logger from '../utils/logger';

export const fetchInstagramInfluencers = async (filters: any) => {
    const { hashtags, minFollowers, maxFollowers, location } = filters;

    logger.info('Fetching Instagram influencers via RapidAPI', { hashtags, minFollowers, maxFollowers });

    const usernames = new Set<string>();
    const results: any[] = [];

    // 1. Collect usernames from hashtags
    for (const tag of hashtags) {
        const cleanTag = tag.trim().replace('#', '');
        if (!cleanTag) continue;

        try {
            logger.info(`Searching Instagram hashtag: #${cleanTag}`);
            const users = await instagramAdapter.searchByHashtag(cleanTag);
            logger.info(`Adapter returned ${users.length} users for #${cleanTag}: ${users.slice(0, 5).join(', ')}...`);
            users.forEach((u: string) => usernames.add(u));
        } catch (error: any) {
            const errorDetail = error.response?.data || error.message;
            logger.error(`Failed to search hashtag #${cleanTag}: ${JSON.stringify(errorDetail)}`);
        }
    }

    logger.info(`Total unique potential influencers found: ${usernames.size}. Limiting to top 10 for performance.`);

    // 2. Fetch profiles & apply filters (Limit to 10 to avoid timeout)
    const limitedUsernames = Array.from(usernames).slice(0, 10);

    for (let i = 0; i < limitedUsernames.length; i++) {
        const username = limitedUsernames[i];
        try {
            logger.info(`Processing profile ${i + 1}/${limitedUsernames.length}: ${username}`);

            // Add a small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 300));

            const profile: any = await instagramAdapter.getProfile(username);
            if (!profile) {
                logger.warn(`No profile found for ${username}`);
                continue;
            }

            logger.debug(`Profile data for ${username}:`, JSON.stringify(profile).substring(0, 500));

            // Instagram120 API response mapping
            const followers = profile.follower_count || profile.followers || profile.followerCount || 0;
            const following = profile.following_count || profile.following || profile.followingCount || 0;
            const posts = profile.media_count || profile.posts || profile.postsCount || 0;
            const bio = profile.biography || profile.bio || profile.description || '';
            const fullName = profile.full_name || profile.fullName || profile.display_name || profile.username || '';
            const profilePicUrl = profile.profile_pic_url || profile.profilePicUrl || profile.profile_picture || '';
            const isVerified = profile.is_verified || profile.verified || false;
            const isPrivate = profile.is_private || profile.private || false;

            if (minFollowers && followers < minFollowers) {
                logger.info(`Skipping ${username}: ${followers} followers < ${minFollowers}`);
                continue;
            }
            if (maxFollowers && followers > maxFollowers) {
                logger.info(`Skipping ${username}: ${followers} followers > ${maxFollowers}`);
                continue;
            }

            // Skip private accounts
            if (isPrivate) {
                logger.info(`Skipping ${username}: Private account`);
                continue;
            }

            const savedInfluencer = await influencerService.upsertInfluencer({
                platform: 'INSTAGRAM',
                externalUserId: profile.pk || profile.id || username,
                username: profile.username || username,
                fullName: fullName || username,
                bio: bio,
                followerCount: followers,
                followingCount: following,
                postsCount: posts,
                verified: isVerified,
                locationCity: location?.city,
                locationCountry: location?.country || 'IN',
                profilePicUrl: profilePicUrl,
                platformMetadata: profile
            });

            logger.info(`✓ Saved influencer: ${savedInfluencer.username}`);
            results.push(savedInfluencer);
        } catch (error: any) {
            logger.error(`Failed to process user ${username}`, error.message);
        }
    }

    return results;
};
