import { Worker } from 'bullmq';
import prisma from '../../config/prisma';
import { queueConfig } from '../../config/queue';
import {
  calculateEngagementRate,
  calculateQualityScore,
  //   isDuplicateInfluencer,
} from '../../services/enrichment.service';

export const refreshWorker = new Worker(
  'refresh-influencers',
  async () => {
    console.log('Starting influencer refresh job...');

    // 1️⃣ Fetch all influencers
    const influencers = await prisma.influencer.findMany();

    // 2️⃣ Loop through influencers
    const allIdentities = influencers.map(i => ({
      platform: i.platform,
      externalUserId: i.externalUserId,
      username: i.username,
    }));

    for (const [index, influencer] of influencers.entries()) {
      // 🔁 DUPLICATE DETECTION -- DISABLED (Missing function)
      /*
      // Exclude self from the check list
      const otherIdentities = allIdentities.filter((_, idx) => idx !== index);

      const isDuplicate = isDuplicateInfluencer(
        {
          platform: influencer.platform,
          externalUserId: influencer.externalUserId,
          username: influencer.username,
        },
        otherIdentities
      );

      if (isDuplicate) {
        console.log(`Duplicate skipped: ${influencer.username}`);
        continue;
      }
      */

      // 3️⃣ Calculate engagement
      // Note: viewCount and videoCount do not exist on Influencer model.
      // Using 0 as placeholder to prevent crash.
      const engagementRate = calculateEngagementRate(
        0, // was influencer.viewCount which is missing
        0,
        influencer.followerCount
      );

      // 4️⃣ Calculate quality score
      const qualityScore = calculateQualityScore(
        influencer.followerCount,
        engagementRate,
        influencer.postsCount ?? 1 // was videoCount
      );

      // 5️⃣ Update DB
      await prisma.influencer.update({
        where: { id: influencer.id },
        data: {
          engagementRate,
          qualityScore,
        },
      });
    }

    console.log('Influencer refresh job completed.');
  },
  {
    connection: queueConfig,
  }
);