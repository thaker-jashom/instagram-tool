import { Queue } from 'bullmq';
import { queueConfig } from '../config/queue';

export interface YouTubeDiscoveryJob {
  location: string;
  keywords: string[];
}

export const youtubeDiscoveryQueue = new Queue<YouTubeDiscoveryJob>(
  'youtube-discovery',
  {
    connection: queueConfig,
  }
);