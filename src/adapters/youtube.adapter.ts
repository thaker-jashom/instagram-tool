import { google, youtube_v3 } from 'googleapis';
import logger from '../utils/logger';

/* ---------- Types ---------- */

export interface YouTubeChannel {
    platform: 'youtube';
    platformUserId: string;
    channelUrl: string;
    username: string | null;
    displayName: string;
    description: string | null;
    profileImageUrl: string | null;
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
    qualityScore: number;
}

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

/* ---------- Adapter ---------- */

export class YouTubeAdapter {
    private youtube: youtube_v3.Youtube | null = null;
    private quotaUsed = 0;
    private cache = new Map<string, CacheEntry<any>>();
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        
        if (!apiKey) {
            logger.warn('YOUTUBE_API_KEY is missing. YouTube adapter will not function.');
            return;
        }

        this.youtube = google.youtube({
            version: 'v3',
            auth: apiKey,
        });
    }

    private isAvailable(): boolean {
        return this.youtube !== null && !!this.apiKey;
    }

    /* ---------- Public Methods ---------- */

    /**
     * Search food-related YouTube channels by location + keywords
     */
    async searchFoodChannels(
        location: string,
        keywords: string[],
        maxResults = 25
    ): Promise<YouTubeChannel[]> {
        if (!this.isAvailable()) {
            logger.warn('YouTube API key not configured. Returning empty results.');
            return [];
        }

        const query = `${location} ${keywords.join(' OR ')}`;
        const cacheKey = `search:${query}`;

        // 1️⃣ Check cache
        const cached = this.getFromCache<YouTubeChannel[]>(cacheKey);
        if (cached) {
            logger.info('YouTube search served from cache');
            return cached;
        }

        // 2️⃣ Track quota (search costs ~100 units)
        this.trackQuota(100);

        // 3️⃣ Call YouTube Search API
        const response = await this.youtube!.search.list({
            part: ['snippet'],
            q: query,
            type: ['channel'],
            regionCode: 'IN',
            maxResults,
        });

        const channelIds =
            response.data.items
                ?.map((item) => item.id?.channelId)
                .filter(Boolean) as string[];

        // 4️⃣ Fetch full channel details
        const channels = await this.getChannelDetails(channelIds);

        // 5️⃣ Cache result
        this.setCache(cacheKey, channels);

        return channels;
    }

    /**
     * Fetch detailed channel statistics
     */
    async getChannelDetails(
        channelIds: string[]
    ): Promise<YouTubeChannel[]> {
        if (!this.isAvailable()) {
            logger.warn('YouTube API key not configured. Returning empty results.');
            return [];
        }

        if (!channelIds.length) return [];

        // Channel list costs ~50 units
        this.trackQuota(50);

        const response = await this.youtube!.channels.list({
            part: ['snippet', 'statistics'],
            id: channelIds,
        });

        return (
            response.data.items?.map((ch) => {
                const subscribers = Number(ch.statistics?.subscriberCount || 0);
                const videos = Number(ch.statistics?.videoCount || 0);
                const views = Number(ch.statistics?.viewCount || 0);

                return {
                    platform: 'youtube',
                    platformUserId: ch.id!,
                    channelUrl: `https://www.youtube.com/channel/${ch.id}`,
                    username: ch.snippet?.customUrl || null,
                    displayName: ch.snippet?.title || '',
                    description: ch.snippet?.description || null,
                    profileImageUrl:
                        ch.snippet?.thumbnails?.high?.url || null,
                    subscriberCount: subscribers,
                    videoCount: videos,
                    viewCount: views,
                    qualityScore: this.calculateQualityScore(
                        subscribers,
                        views,
                        videos
                    ),
                };
            }) || []
        );
    }

    /* ---------- Quality Score ---------- */

    private calculateQualityScore(
        subscribers: number,
        views: number,
        videos: number
    ): number {
        if (subscribers === 0 || videos === 0) return 0;

        const subscriberScore = Math.min(subscribers / 100000, 1);
        const engagementScore = Math.min(views / videos / 10000, 1);
        const contentScore = Math.min(videos / 500, 1);

        return Number(
            (
                subscriberScore * 0.5 +
                engagementScore * 0.3 +
                contentScore * 0.2
            ).toFixed(2)
        );
    }


    /* ---------- Quota Tracking ---------- */

    private trackQuota(units: number) {
        this.quotaUsed += units;
        logger.debug(`YouTube quota used: ${this.quotaUsed}`);
    }

    /* ---------- Cache ---------- */

    private getFromCache<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    

    private setCache<T>(
        key: string,
        data: T,
        ttlMs = 5 * 60 * 1000
    ) {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttlMs,
        });
    }
}