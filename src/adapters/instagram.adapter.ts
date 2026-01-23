import axios from 'axios';

const RAPID_HOST = 'instagram-scraper-api2.p.rapidapi.com';

export class InstagramAdapter {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY || '';
      
        console.log('INSTAGRAM ENV CHECK:', {
          hasKey: !!process.env.RAPIDAPI_KEY,
          keyLength: process.env.RAPIDAPI_KEY?.length,
        });
      } 
         

    async searchByHashtag(hashtag: string): Promise<string[]> {
        const response = await axios.get(
            `https://${RAPID_HOST}/v1/hashtag`,
            {
                params: { hashtag, count: 20 },
                timeout: 30000,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': RAPID_HOST,
                },
            }
        );

        const posts = response.data?.data || [];
        const usernames = new Set<string>();

        for (const post of posts) {
            if (post.owner?.username) {
                usernames.add(post.owner.username);
            }
        }

        return Array.from(usernames);
    }

    async getProfile(username: string): Promise<any> {
        const response = await axios.get(
            `https://${RAPID_HOST}/v1/info`,
            {
                params: { username_or_id_or_url: username },
                timeout: 30000,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': RAPID_HOST,
                },
            }
        );

        return response.data?.data || null;
    }
}


export const instagramAdapter = new InstagramAdapter();