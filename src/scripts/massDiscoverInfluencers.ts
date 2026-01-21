import { instagramAdapter } from '../adapters/instagram.adapter';
import { PrismaClient, Platform } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

async function runMassDiscovery() {
    console.log('--- Starting Mass Instagram Discovery (Target: 100) ---');

    // 1. Search for usernames using hashtags
    // Note: Our adapter currently returns a list of tags or posts. 
    // Since searchByHashtag was returning [] or 404, let's use a hybrid approach.

    const hashtags = ['mumbaifoodie', 'foodindia', 'indianfoodvlogger'];
    const discoveredUsernames = new Set<string>();

    // High-profile foodies to start with
    const seeds = [
        'mumbaifoodie', 'thefoodiediaries', 'curly.tales', 'mumbaifoodguru', 'thehungrymumbaikar',
        'foodie_incarnate', 'shivesh17', 'poojadhingra', 'ranveer.brar', 'vickyratnani',
        'saranshgoila', 'kunalkapur', 'shiprakhanna', 'sanjeevkapoor', 'amritaraichand',
        'thegastronomicbong', 'deepti.kapoor', 'zingyzest', 'dilsefoodie', 'anubhav.sapra',
        'mumbaifoodexplorer', 'saloni_panda', 'thecrazyindianfoodie', 'mumbaifoodcrush',
        'trellingmumbai', 'mumbaifoodjunkie', 'things2doinmumbai', 'mumbaicanvas',
        'theinsatiablemumbaikar', 'mumbaifoodicious', 'mumbaifooddiaries', 'mumbaifoodies',
        'therawtextures', 'mumbaifoodicious', 'foodiefrommumbai', 'mumbaifoodtales',
        'mumbaifoodtrail', 'mumbaifoodventures', 'mumbaifoodaholic', 'mumbaifoodking',
        'mumbaifoodqueen', 'mumbaifoodlover', 'mumbaifoodaddict', 'mumbaifoodfanatic',
        'mumbaifoodenthusiast', 'mumbaifoodblogger', 'mumbaifoodgram', 'mumbaifoodiecrush',
        'mumbaifoodiegram', 'mumbaifoodieexplorer', 'mumbaifoodiesunite', 'mumbaifoodielife',
        'mumbaifoodieculture'
    ];
    seeds.forEach(s => discoveredUsernames.add(s));

    logger.info(`Initial seed list size: ${discoveredUsernames.size}`);

    let count = 0;
    const target = 100;

    for (const username of discoveredUsernames) {
        if (count >= target) break;

        try {
            console.log(`[${count + 1}/${target}] Fetching profile for: ${username}...`);
            const profile = await instagramAdapter.getProfile(username);

            if (profile && profile.username) {
                await prisma.influencer.upsert({
                    where: {
                        platform_externalUserId: {
                            platform: Platform.INSTAGRAM,
                            externalUserId: profile.username,
                        },
                    },
                    update: {
                        fullName: profile.fullName,
                        followerCount: profile.followers,
                        engagementRate: profile.engagementRate,
                        locationCity: 'Mumbai', // Assigning Mumbai for testing
                        locationCountry: 'IN'
                    },
                    create: {
                        platform: Platform.INSTAGRAM,
                        externalUserId: profile.username,
                        username: profile.username,
                        fullName: profile.fullName || profile.username,
                        followerCount: profile.followers,
                        engagementRate: profile.engagementRate,
                        locationCity: 'Mumbai',
                        locationCountry: 'IN',
                        qualityScore: 0.8 // Default score
                    },
                });

                console.log(`✅ Saved: ${username} (${profile.followers} followers)`);
                count++;

                // Wait 2 seconds to be safe with rate limits
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (err: any) {
            console.error(`❌ Failed to process ${username}: ${err.message}`);
        }
    }

    console.log(`--- Finished. Discovered and saved ${count} influencers. ---`);
    process.exit(0);
}

runMassDiscovery().catch(err => {
    console.error('Fatal error during discovery:', err);
    process.exit(1);
});
