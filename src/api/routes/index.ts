import { Router } from 'express';

import healthRoutes from './health.routes';
import youtubeDiscoveryRoutes from './youtubeDiscovery.routes';
import discoveryRoutes from './discovery.routes';
import searchRoutes from './search.routes';
import influencerRoutes from './influencers.routes';
import instagramFetchRoutes from './instagramFetch.routes';
import youtubeFetchRoutes from './youtubeFetch.routes';
import savedInfluencerRoutes from './savedInfluencer.routes';
import savedSearchRoutes from './savedSearch.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/discovery', youtubeDiscoveryRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/search', searchRoutes);
router.use('/influencers', influencerRoutes);
router.use('/instagram', instagramFetchRoutes);
router.use('/youtube', youtubeFetchRoutes);
router.use('/saved-influencers', savedInfluencerRoutes);
router.use('/saved-searches', savedSearchRoutes);

export default router;