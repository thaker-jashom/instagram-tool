import { Router } from 'express';
import { startYouTubeDiscovery } from '../controllers/youtubeDiscovery.controller';

const router = Router();

router.post('/youtube', startYouTubeDiscovery);

export default router;