import { Queue } from 'bullmq';
import { queueConfig } from '../config/queue';

export const refreshInfluencersQueue = new Queue(
  'refresh-influencers',
  { connection: queueConfig }
);

// Run every 24 hours
refreshInfluencersQueue.add(
  'daily-refresh',
  {},
  {
    repeat: { every: 24 * 60 * 60 * 1000 },
  }
);