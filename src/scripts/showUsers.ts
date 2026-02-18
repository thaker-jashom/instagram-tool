import 'dotenv/config';
import prisma from '../config/prisma';

async function showUsers() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  Registered Users in Database         ║');
    console.log('╚════════════════════════════════════════╝\n');

    try {
        await prisma.$connect();

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        savedInfluencers: true,
                        savedSearches: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Total Users: ${users.length}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        users.forEach((user, index) => {
            const date = new Date(user.createdAt!);
            console.log(`${index + 1}. ${user.email}`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Registered: ${date.toLocaleString()}`);
            console.log(`   Saved Influencers: ${user._count.savedInfluencers}`);
            console.log(`   Saved Searches: ${user._count.savedSearches}`);
            console.log('');
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📍 Database: Supabase PostgreSQL');
        console.log('📍 Table: User');
        console.log('📍 Stored Fields: id, email, password (hashed), createdAt');
        console.log('📍 NOT Stored: firstName, lastName\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

showUsers();
