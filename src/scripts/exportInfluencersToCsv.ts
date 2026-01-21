import fs from 'fs';
import path from 'path';
import prisma from '../config/prisma';
import logger from '../utils/logger';

async function exportInfluencers() {
    logger.info('Starting CSV export...');

    try {
        const influencers = await prisma.influencer.findMany();

        if (influencers.length === 0) {
            logger.warn('No influencers found to export.');
            return;
        }

        const headers = [
            'id',
            'username',
            'fullName',
            'bio',
            'locationCity',
            'locationState',
            'locationCountry',
            'platform',
            'followerCount',
            'engagementRate',
            'externalUserId',
            'profilePicUrl',
            'createdAt',
            'updatedAt',
            'followingCount',
            'postsCount',
            'verified',
            'businessAccount',
            'email',
            'phone',
            'website',
            'platformMetadata',
            'qualityScore',
            'categories',
            'cuisineTypes',
            'contentLanguages',
        ];

        const csvRows = influencers.map((inf) => {
            const row = [
                inf.id,
                inf.username,
                inf.fullName,
                inf.bio ?? '',
                inf.locationCity ?? '',
                inf.locationState ?? '',
                inf.locationCountry ?? '',
                inf.platform,
                inf.followerCount,
                inf.engagementRate ?? '',
                inf.externalUserId,
                inf.profilePicUrl ?? '',
                inf.createdAt.toISOString(),
                inf.updatedAt.toISOString(),
                inf.followingCount ?? '',
                inf.postsCount ?? '',
                inf.verified ?? '',
                inf.businessAccount ?? '',
                inf.email ?? '',
                inf.phone ?? '',
                inf.website ?? '',
                JSON.stringify(inf.platformMetadata ?? {}),
                inf.qualityScore?.toString() ?? '',
                (inf.categories || []).join('; '),
                (inf.cuisineTypes || []).join('; '),
                (inf.contentLanguages || []).join('; '),
            ];

            // Escape quotes for CSV format AND remove newlines
            return row
                .map((field) => {
                    const stringValue = String(field ?? '')
                        .replace(/[\r\n]+/g, ' ') // Replace newlines with space
                        .replace(/"/g, '""'); // Escape double quotes

                    return `"${stringValue}"`;
                })
                .join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const outputPath = path.resolve(process.cwd(), 'influencers.csv');

        fs.writeFileSync(outputPath, csvContent);
        logger.info(
            `✅ Successfully exported ${influencers.length} influencers to ${outputPath}`
        );
    } catch (error) {
        logger.error('❌ Export failed', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

exportInfluencers();
