import 'dotenv/config';

export const rapidApiConfig = {
    // If process.env.RAPIDAPI_KEY is missing, we use the one provided by the user in the test
    key: process.env.RAPIDAPI_KEY || 'be61fcc241mshc02c2f4948e4f96p181797jsn8d512890aab6',
    instagramHost: process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram120.p.rapidapi.com',
};

// Log warning if we are using fallback values
if (!process.env.RAPIDAPI_KEY) {
    console.warn('WARNING: Using fallback RAPIDAPI_KEY. Please set RAPIDAPI_KEY in your .env file.');
}
if (!process.env.RAPIDAPI_INSTAGRAM_HOST) {
    console.warn('WARNING: Using fallback RAPIDAPI_INSTAGRAM_HOST. Please set RAPIDAPI_INSTAGRAM_HOST in your .env file.');
}