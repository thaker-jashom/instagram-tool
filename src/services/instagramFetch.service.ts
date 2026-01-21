import { InstagramAdapter } from '../adapters/instagram.adapter';
import { influencerService } from './influencer.service';

const instagramAdapter = new InstagramAdapter();

export const fetchInstagramInfluencers = async (filters: any) => {
    const { hashtags, minFollowers, maxFollowers, location } = filters;

    const usernames = new Set<string>();
    const results: any[] = [];

    // 1. Collect usernames from hashtags
    for (const tag of hashtags) {
        const cleanTag = tag.replace('#', '');
        const users = await instagramAdapter.searchByHashtag(cleanTag);
        users.forEach((u: string) => usernames.add(u));
    }

    // 2. Fetch profiles & apply filters
    for (const username of usernames) {
        const profile: any = await instagramAdapter.getProfile(username);
        if (!profile) continue;

        const followers = profile.followers || profile.followerCount || 0;
        const posts = profile.posts || profile.postsCount || 0;

        if (minFollowers && followers < minFollowers) continue;
        if (maxFollowers && followers > maxFollowers) continue;

        const savedInfluencer = await influencerService.upsertInfluencer({
            platform: 'INSTAGRAM',
            externalUserId: profile.id || profile.pk || username,
            username: profile.username,
            fullName: profile.fullName || profile.display_name,
            bio: profile.biography || profile.bio,
            followerCount: followers,
            postsCount: posts,
            locationCity: location?.city,
            locationCountry: location?.country,
            platformMetadata: profile
        });

        results.push(savedInfluencer);
    }

    return results;
};
