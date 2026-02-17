import axios from 'axios';

const RAPID_HOST = process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram120.p.rapidapi.com';

export class InstagramAdapter {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY || '';

        console.log('INSTAGRAM ENV CHECK:', {
            hasKey: !!process.env.RAPIDAPI_KEY,
            keyLength: process.env.RAPIDAPI_KEY?.length,
            host: RAPID_HOST
        });
    }

    /**
     * Search for users - Instagram120 doesn't have search, so we'll use known food influencers
     */
    async searchUsers(keyword: string): Promise<string[]> {
        // Instagram120 API doesn't have a search endpoint
        // Return curated list of food influencers based on keyword
        const foodInfluencers = [
            'foodnetwork', 'tasty', 'buzzfeedtasty', 'foodblogfeed',
            'thefeedfeed', 'foodgawker', 'eater', 'bonappetitmag',
            'seriouseats', 'foodandwine', 'epicurious', 'delish'
        ];
        
        const indianFoodInfluencers = [
            'foodtalkindia', 'indianfoodbloggers', 'delhifoodblogger',
            'mumbaifoodie', 'bangalorefoodie', 'punefoodie'
        ];
        
        const keywordLower = keyword.toLowerCase();
        
        if (keywordLower.includes('india') || keywordLower.includes('mumbai') || 
            keywordLower.includes('delhi') || keywordLower.includes('bangalore')) {
            return indianFoodInfluencers;
        }
        
        return foodInfluencers.slice(0, 10);
    }

    async searchByHashtag(hashtag: string): Promise<string[]> {
        // Use curated list since Instagram120 doesn't have hashtag search
        return await this.searchUsers(hashtag);
    }

    async getProfile(username: string): Promise<any> {
        try {
            // The correct endpoint is /api/instagram/userInfo
            const response = await axios.post(
                `https://${RAPID_HOST}/api/instagram/userInfo`,
                { username },
                {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': this.apiKey,
                        'X-RapidAPI-Host': RAPID_HOST,
                    },
                }
            );

            console.log(`DEBUG: Profile response for ${username}:`, JSON.stringify(response.data).substring(0, 300));

            // Extract user data from result array
            const result = response.data?.result?.[0];
            const user = result?.user;
            
            if (!user) {
                console.error(`No user data found for ${username}`);
                return null;
            }
            
            // Map the Instagram120 response to our expected format
            return {
                pk: user.pk || user.pk_id || user.id,
                username: user.username,
                full_name: user.full_name,
                biography: user.biography,
                follower_count: user.follower_count,
                following_count: user.following_count,
                media_count: user.media_count,
                is_verified: user.is_verified,
                is_private: user.is_private,
                profile_pic_url: user.profile_pic_url,
                external_url: user.external_url,
                is_business: user.is_business,
                category: user.category,
                // Store full user object for reference
                _raw: user
            };
            
        } catch (error: any) {
            if (error.response?.status === 429) {
                console.error('❌ Instagram API Quota Exceeded! Please check your RapidAPI plan.');
            }
            console.error('Failed to get profile:', error.response?.data || error.message);
            return null;
        }
    }
}


export const instagramAdapter = new InstagramAdapter();
