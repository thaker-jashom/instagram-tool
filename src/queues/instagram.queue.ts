import { Queue } from 'bullmq';
import { queueConfig } from '../config/queue';

/* ---------- Job Data Type ---------- */

export interface InstagramDiscoveryJob {
    hashtags?: string[];
    usernames?: string[];
    location?: string;
}

/* ---------- Queue Definition ---------- */

export const instagramQueue = new Queue<InstagramDiscoveryJob>('instagram-discovery', {
    connection: queueConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
