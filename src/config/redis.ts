import Redis from 'ioredis';
import logger from '../utils/logger';

let redis: Redis | null = null;

export const initRedis = () => {
    if (!process.env.REDIS_URL) {
        logger.warn('REDIS_URL not set — Redis client not created');
        return null;
    }

    redis = new Redis(process.env.REDIS_URL);

    redis.on('connect', () => {
        logger.info('Redis connected');
    });

    redis.on('error', (err) => {
        logger.error('Redis error', err);
    });

    return redis;
};

export const getRedis = () => redis;