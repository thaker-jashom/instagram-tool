import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Migration Script: Local Database → Supabase
 * 
 * This script:
 * 1. Connects to local database
 * 2. Exports all data
 * 3. Connects to Supabase
 * 4. Imports all data
 */

if (!process.env.LOCAL_DATABASE_URL) {
    console.error('❌ LOCAL_DATABASE_URL not found in .env');
    console.log('Please add: LOCAL_DATABASE_URL=postgresql://user:password@localhost:5432/dbname');
    process.exit(1);
}

if (!process.env.SUPABASE_DATABASE_URL) {
    console.error('❌ SUPABASE_DATABASE_URL not found in .env');
    console.log('Please add: SUPABASE_DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require');
    process.exit(1);
}

// Local database connection
const localPrisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.LOCAL_DATABASE_URL
        }
    }
});

// Supabase connection
const supabasePrisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.SUPABASE_DATABASE_URL
        }
    }
});

async function migrateData() {
    try {
        console.log('🚀 Starting migration from Local DB to Supabase...\n');

        // Step 1: Connect to local database
        console.log('📡 Connecting to local database...');
        await localPrisma.$connect();
        console.log('✅ Connected to local database\n');

        // Step 2: Export data from local database
        console.log('📤 Exporting data from local database...');
        
        const users = await localPrisma.user.findMany();
        console.log(`   Found ${users.length} users`);
        
        const influencers = await localPrisma.influencer.findMany();
        console.log(`   Found ${influencers.length} influencers`);
        
        const savedSearches = await localPrisma.savedSearch.findMany();
        console.log(`   Found ${savedSearches.length} saved searches`);
        
        const savedInfluencers = await localPrisma.savedInfluencer.findMany();
        console.log(`   Found ${savedInfluencers.length} saved influencers`);
        
        console.log('✅ Data exported from local database\n');

        // Step 3: Connect to Supabase
        console.log('📡 Connecting to Supabase...');
        await supabasePrisma.$connect();
        console.log('✅ Connected to Supabase\n');

        // Step 4: Import data to Supabase
        console.log('📥 Importing data to Supabase...');

        // Import Users
        if (users.length > 0) {
            console.log(`   Importing ${users.length} users...`);
            for (const user of users) {
                await supabasePrisma.user.upsert({
                    where: { id: user.id },
                    update: user,
                    create: user
                });
            }
            console.log('   ✅ Users imported');
        }

        // Import Influencers
        if (influencers.length > 0) {
            console.log(`   Importing ${influencers.length} influencers...`);
            for (const influencer of influencers) {
                // Prepare influencer data, handling JSON fields properly
                const influencerData = {
                    ...influencer,
                    platformMetadata: influencer.platformMetadata || null
                };
                
                await supabasePrisma.influencer.upsert({
                    where: { 
                        platform_externalUserId: {
                            platform: influencer.platform,
                            externalUserId: influencer.externalUserId
                        }
                    },
                    update: influencerData as any,
                    create: influencerData as any
                });
            }
            console.log('   ✅ Influencers imported');
        }

        // Import Saved Searches
        if (savedSearches.length > 0) {
            console.log(`   Importing ${savedSearches.length} saved searches...`);
            for (const search of savedSearches) {
                await supabasePrisma.savedSearch.upsert({
                    where: { id: search.id },
                    update: search,
                    create: search
                });
            }
            console.log('   ✅ Saved searches imported');
        }

        // Import Saved Influencers
        if (savedInfluencers.length > 0) {
            console.log(`   Importing ${savedInfluencers.length} saved influencers...`);
            for (const saved of savedInfluencers) {
                await supabasePrisma.savedInfluencer.upsert({
                    where: {
                        userId_influencerId: {
                            userId: saved.userId,
                            influencerId: saved.influencerId
                        }
                    },
                    update: saved,
                    create: saved
                });
            }
            console.log('   ✅ Saved influencers imported');
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${users.length}`);
        console.log(`   Influencers: ${influencers.length}`);
        console.log(`   Saved Searches: ${savedSearches.length}`);
        console.log(`   Saved Influencers: ${savedInfluencers.length}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await localPrisma.$disconnect();
        await supabasePrisma.$disconnect();
        console.log('\n🔌 Disconnected from databases');
    }
}

// Run migration
migrateData()
    .then(() => {
        console.log('\n🎉 Migration script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration script failed:', error);
        process.exit(1);
    });

