import { redis } from '../config/redis';
import logger from './logger';

/**
 * Get data from cache or fetch and set it.
 * Gracefully handles Redis failures.
 */
export const getOrSet = async <T>(
    key: string,
    ttl: number,
    asyncFn: () => Promise<T>
): Promise<T> => {
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const freshData = await asyncFn();
        await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
        return freshData;
    } catch (error) {
        logger.error(`Cache Error [${key}]:`, error);
        // Fail gracefully: fetch data directly from source if Redis is down
        return await asyncFn();
    }
};

/**
 * Generate a unique cache key based on request payload
 */
export const generateCacheKey = (prefix: string, payload: any): string => {
    const sortedPayload = Object.keys(payload)
        .sort()
        .reduce((acc: any, key) => {
            acc[key] = payload[key];
            return acc;
        }, {});

    return `${prefix}:${JSON.stringify(sortedPayload)}`;
};
