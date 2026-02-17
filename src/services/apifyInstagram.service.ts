import axios from 'axios';
import logger from '../utils/logger';

export async function fetchInstagramInfluencersViaApify({ hashtags, limit = 50 }) {
  const token = process.env.APIFY_TOKEN;

  if (!token) {
    throw new Error('APIFY_TOKEN is not configured');
  }

  logger.info('Starting Apify Instagram scraper run', { hashtags, limit });

  // Start the Apify actor run
  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs?token=${token}`,
    {
      hashtags: hashtags.map((h: string) => h.replace('#', '')),
      resultsLimit: limit,
      resultsType: 'posts',
      searchType: 'hashtag',
      addParentData: false
    },
    {
      timeout: 10000
    }
  );

  const runId = runRes.data.data.id;
  logger.info(`Apify run started: ${runId}`);

  // Poll for completion (max 2 minutes)
  let status = 'RUNNING';
  let attempts = 0;
  const maxAttempts = 24; // 24 * 5 seconds = 2 minutes

  while (status === 'RUNNING' && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000)); // Wait 5 seconds
    attempts++;

    const statusRes = await axios.get(
      `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs/${runId}?token=${token}`
    );

    status = statusRes.data.data.status;
    logger.info(`Apify run status: ${status} (attempt ${attempts}/${maxAttempts})`);
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Apify run did not complete successfully. Status: ${status}`);
  }

  // Fetch the dataset results
  const datasetId = runRes.data.data.defaultDatasetId;
  const dataRes = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`
  );

  const posts = dataRes.data || [];
  logger.info(`Retrieved ${posts.length} posts from Apify`);

  // Extract unique influencers from posts
  const influencersMap = new Map();

  for (const post of posts) {
    if (!post.ownerUsername) continue;

    const username = post.ownerUsername;

    if (!influencersMap.has(username)) {
      influencersMap.set(username, {
        username: username,
        fullName: post.ownerFullName || username,
        followerCount: 0, // Apify hashtag scraper doesn't provide follower count directly
        platform: 'INSTAGRAM',
        externalUserId: post.ownerId || username,
        profilePicUrl: post.profilePicUrl,
        postsCount: 1,
        bio: '',
        locationCountry: 'IN' // Default to India
      });
    } else {
      // Increment post count for this influencer
      const existing = influencersMap.get(username);
      existing.postsCount++;
    }
  }

  return Array.from(influencersMap.values());
}