import {
    calculateEngagementRate,
    calculateQualityScore,
    //     isDuplicateInfluencer,
} from '../services/enrichment.service';

const engagement = calculateEngagementRate(
    1000, // likes (placeholder)
    500,  // comments (placeholder)
    100000 // followers
);

const qualityScore = calculateQualityScore(
    100000, // followers
    engagement,
    100      // posts
);

console.log('Engagement Rate:', engagement);
console.log('Quality Score:', qualityScore);

const existingInfluencers = [
    {
        platform: 'YOUTUBE' as const,
        externalUserId: 'UC123',
        username: 'foodie123',
    },
];

const newInfluencer = {
    platform: 'YOUTUBE' as const,
    externalUserId: 'UC123',
    username: 'foodie_new',
};

// console.log(
//     'Is Duplicate:',
//     isDuplicateInfluencer(newInfluencer, existingInfluencers)
// );

// import {
//     calculateProfileCompleteness,
// } from '../services/enrichment.service';

const profile = {
    username: 'foodie123',
    fullName: 'Street Food Lover',
    bio: 'I love street food',
    profilePicUrl: 'http://image.jpg',
    followerCount: 10000,
    engagementRate: 0.05,
};

// console.log(
//     'Profile Completeness:',
//     calculateProfileCompleteness(profile)
// );
