import prisma from '../config/prisma';

export const influencerService = {
    async upsertInfluencer(data: any) {
        return prisma.influencer.upsert({
            where: {
                platform_externalUserId: {
                    platform: data.platform,
                    externalUserId: data.externalUserId
                }
            },
            update: {
                followerCount: data.followerCount,
                postsCount: data.postsCount,
                bio: data.bio,
                fullName: data.fullName,
                platformMetadata: data.platformMetadata,
                locationCity: data.locationCity,
                locationCountry: data.locationCountry
            },
            create: data
        });
    }
};