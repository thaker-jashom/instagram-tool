import { PrismaClient, Platform } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        // Create a dummy influencer
        const influencer = await prisma.influencer.create({
            data: {
                username: 'test_influencer_' + Date.now(),
                fullName: 'Test Influencer',
                platform: Platform.INSTAGRAM,
                followerCount: 1000,
                externalUserId: 'test_id_' + Date.now(),
                locationCity: 'Mumbai',
                locationCountry: 'IN',
            },
        });
        console.log('Created influencer:', influencer.id);

        // Query it back
        const found = await prisma.influencer.findUnique({
            where: { id: influencer.id },
        });
        console.log('Found influencer:', found?.username);

        // Clean up
        await prisma.influencer.delete({
            where: { id: influencer.id },
        });
        console.log('Deleted test influencer');

        console.log('Database verification successful!');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
