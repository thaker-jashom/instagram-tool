import { Router } from 'express';

import healthRoutes from './health.routes';
import youtubeDiscoveryRoutes from './youtubeDiscovery.routes';
import discoveryRoutes from './discovery.routes';
import searchRoutes from './search.routes';
import influencerRoutes from './influencers.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/discovery', youtubeDiscoveryRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/search', searchRoutes);
router.use('/influencers', influencerRoutes);

export default router;