import { ConnectionOptions } from 'bullmq';
import { config } from './env';

const url = new URL(config.redisUrl);

export const queueConfig: ConnectionOptions = {
    host: url.hostname,
    port: Number(url.port || 6379),
    password: url.password || undefined
};