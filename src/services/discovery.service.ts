import { InstagramAdapter } from '../adapters/instagram.adapter';
import logger from '../utils/logger';

const instagramAdapter = new InstagramAdapter();

/* ---------- Types ---------- */

/**
 * Local Instagram profile type
 * (Matches what instagram.adapter.getProfile() returns)
 */
export interface InstagramProfile {
    id?: string;
    username: string;
    fullName?: string;
    biography?: string;
    followers: number;
    posts?: number;
    engagementRate?: number; // ✅ ADD THIS
    metadata?: any;
}

export interface DiscoveryInput {
    hashtags?: string[];
    usernames?: string[];
    location?: string;
}

export interface DiscoveryResult {
    profiles: InstagramProfile[];
    source: 'hashtag' | 'username';
    query: string;
}

/* ---------- Discovery Service ---------- */

/**
 * Service layer for Instagram discovery.
 * Orchestrates calls to InstagramAdapter and returns normalized data.
 */
export class DiscoveryService {

    /**
     * Discover Instagram influencers based on hashtags and/or usernames
     */
    async discoverInstagram(input: DiscoveryInput): Promise<DiscoveryResult[]> {
        const results: DiscoveryResult[] = [];

        try {
            // 1️⃣ Process usernames if provided
            if (input.usernames && input.usernames.length > 0) {
                logger.info(`Discovering Instagram profiles by username: ${input.usernames.join(', ')}`);

                for (const username of input.usernames) {
                    try {
                        const profile: InstagramProfile = await instagramAdapter.getProfile(username);

                        if (profile?.username && profile.followers > 0) {
                            results.push({
                                profiles: [profile],
                                source: 'username',
                                query: username
                            });
                        }
                    } catch (error) {
                        logger.warn(`Failed to fetch profile for username: ${username}`, error);
                    }
                }
            }

            // 2️⃣ Process hashtags if provided
            if (input.hashtags && input.hashtags.length > 0) {
                logger.info(`Discovering Instagram profiles by hashtag: ${input.hashtags.join(', ')}`);

                for (const hashtag of input.hashtags) {
                    try {
                        // searchByHashtag RETURNS string[] (usernames)
                        const usernames = await instagramAdapter.searchByHashtag(hashtag);

                        if (Array.isArray(usernames) && usernames.length > 0) {
                            const profiles: InstagramProfile[] = [];

                            // limit to avoid rate limits
                            const limitedUsernames = usernames.slice(0, 10);

                            for (const username of limitedUsernames) {
                                try {
                                    const profile: InstagramProfile = await instagramAdapter.getProfile(username);
                                    if (profile?.username && profile.followers > 0) {
                                        profiles.push(profile);
                                    }
                                } catch (error) {
                                    logger.warn(`Failed to fetch profile for hashtag user: ${username}`, error);
                                }
                            }

                            if (profiles.length > 0) {
                                results.push({
                                    profiles,
                                    source: 'hashtag',
                                    query: hashtag
                                });
                            }
                        }
                    } catch (error) {
                        logger.warn(`Failed to search hashtag: ${hashtag}`, error);
                    }
                }
            }

            logger.info(`Instagram discovery completed. Found ${results.length} result groups`);
            return results;

        } catch (error) {
            logger.error('Instagram discovery failed:', error);
            return [];
        }
    }

    /**
     * Flatten discovery results into a single profile list
     */
    flattenResults(results: DiscoveryResult[]): InstagramProfile[] {
        return results.flatMap(result => result.profiles);
    }
}

// Export singleton instance
export const discoveryService = new DiscoveryService();