import dotenv from 'dotenv';
dotenv.config();

import { youtubeDiscoveryQueue } from '../queues/youtube.queue';

(async () => {
    const job = await youtubeDiscoveryQueue.add('discover', {
        location: 'Mumbai',
        keywords: ['street food', 'food vlogger'],
    });

    console.log('YouTube discovery job queued with ID:', job.id);
})();