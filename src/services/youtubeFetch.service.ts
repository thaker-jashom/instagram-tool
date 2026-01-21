import { YouTubeAdapter } from '../adapters/youtube.adapter';
import { influencerService } from './influencer.service';
import logger from '../utils/logger';

// Ensure API Key is available, otherwise log warning
const apiKey = process.env.YOUTUBE_API_KEY || '';
if (!apiKey) {
    logger.warn('YOUTUBE_API_KEY is missing. YouTube discovery will fail or return empty.');
}

const youtubeAdapter = new YouTubeAdapter(apiKey);

export const fetchYoutubeInfluencers = async (filters: any) => {
    const { hashtags, location } = filters;
    // YouTube search uses keywords. We use hashtags as keywords.
    // If no hashtags, we might skip, but prompts usually require them.

    // Check if we have keywords/hashtags
    if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
        return [];
    }

    // Clean hashtags to make them keywords (remove #)
    const keywords = hashtags.map((h: string) => h.replace('#', ''));

    // Default location if missing (Adapter requires string, defaults to 'IN' in some places but let's be safe)
    const searchLocation = location?.city || 'India';
    // OR just pass empty string if adapter handles it? 
    // Adapter signature: searchFoodChannels(location, keywords)
    // Looking at youtube.worker.ts, it passes 'location' string.

    const results: any[] = [];

    try {
        const channels = await youtubeAdapter.searchFoodChannels(searchLocation, keywords);

        for (const channel of channels) {
            // Upsert to DB to get UUID and ensure persistence
            const savedInfluencer = await influencerService.upsertInfluencer({
                platform: 'YOUTUBE',
                externalUserId: channel.platformUserId,
                username: channel.username || channel.platformUserId, // Fallback if customUrl is null
                fullName: channel.displayName,
                bio: channel.description,
                followerCount: channel.subscriberCount, // subscribers
                postsCount: channel.videoCount, // videos
                locationCity: location?.city,
                locationCountry: location?.country || 'IN',
                profilePicUrl: channel.profileImageUrl,
                platformMetadata: channel
            });

            // Push the DB record (with ID) to results
            results.push(savedInfluencer);
        }
    } catch (error) {
        logger.error('Error fetching YouTube influencers:', error);
        // We return empty array on failure so as not to break the combined response
        return [];
    }

    return results;
};
