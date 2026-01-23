import axios from 'axios';

export async function fetchInstagramInfluencersViaApify({ hashtags, limit }) {
  const token = process.env.APIFY_TOKEN;

  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${token}`,
    {
      hashtags,
      resultsLimit: limit || 50,
      scrapeProfiles: true
    }
  );

  const runId = runRes.data.data.id;

  // wait & fetch dataset (simplified)
}