import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("No user found. Please login once.");
        return;
    }

    const influencers = await prisma.influencer.findMany();

    if (influencers.length === 0) {
        console.log("No influencers found.");
        return;
    }

    await prisma.savedInfluencer.createMany({
        data: influencers.map((i) => ({
            userId: user.id,
            influencerId: i.id,
        })),
        skipDuplicates: true,
    });

    console.log("All influencers linked to user:", user.email);
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());