import { Queue } from 'bullmq';
import { queueConfig } from '../config/queue';

// Define queues here
// export const emailQueue = new Queue('email', { connection: queueConfig });

export const queues: Queue[] = []; // Add queues to this array for easy management
