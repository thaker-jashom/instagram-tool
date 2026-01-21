import prisma from '../config/prisma';
import logger from '../utils/logger';

import {
    calculateEngagementRate,
    calculateQualityScore,
} from '../services/enrichment.service';

import {
    extractCategories,
    extractCuisines,
    detectLanguages,
    extractLocations,
} from '../services/contentClassification.service';

async function runEnrichment() {
    logger.info('Starting enrichment job...');

    const influencers = await prisma.influencer.findMany({
        take: 100, // HR requirement
    });

    for (const inf of influencers) {
        // 1️⃣ Engagement
        const engagementRate = calculateEngagementRate(
            inf.followerCount,
            inf.engagementRate ?? 0,
            inf.postsCount ?? 1
        );

        // 2️⃣ Quality score (safe bounds)
        const qualityScore = calculateQualityScore(
            inf.followerCount,
            engagementRate,
            inf.postsCount ?? 1
        );

        // 3️⃣ Classification
        const categories = extractCategories(inf.bio);
        const cuisines = extractCuisines(inf.bio);
        const languages = detectLanguages(inf.bio);

        // 4️⃣ Location extraction (ARRAY → STRUCTURED)
        const locations = extractLocations(inf.bio);

        const locationCity = locations.city ?? inf.locationCity;
        const locationCountry = locations.country ?? inf.locationCountry ?? 'IN';

        // 5️⃣ Persist enrichment (SANITIZED)
        const safeCategories = (categories || [])
            .map((c) => c.slice(0, 50))
            .slice(0, 5);

        const safeCuisines = (cuisines || [])
            .map((c) => c.slice(0, 50))
            .slice(0, 5);

        const safeLanguages = (languages || [])
            .map((l) => l.slice(0, 20))
            .slice(0, 5);

        const safeCity =
            typeof locationCity === 'string'
                ? locationCity.slice(0, 100)
                : null;

        const safeCountry =
            locationCountry && locationCountry.length === 2
                ? locationCountry
                : 'IN';

        // 5️⃣ Persist enrichment
        await prisma.influencer.update({
            where: { id: inf.id },
            data: {
                engagementRate,
                qualityScore,

                categories: safeCategories,
                cuisineTypes: safeCuisines,
                contentLanguages: safeLanguages,

                locationCity: safeCity,
                locationCountry: safeCountry,
            },
        });
    }

    logger.info('✅ Enrichment completed successfully');
}

runEnrichment()
    .catch((err) => {
        logger.error('❌ Enrichment failed', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });