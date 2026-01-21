import 'dotenv/config';
import instagramAdapter from '../adapters/instagram.adapter';
import { rapidApiConfig } from '../config/rapidapi';
import logger from '../utils/logger';

console.log('--- RapidAPI Configuration ---');
console.log('Host:', rapidApiConfig.instagramHost);
console.log('Key:', rapidApiConfig.key.substring(0, 5) + '...' + rapidApiConfig.key.substring(rapidApiConfig.key.length - 5));
console.log('------------------------------\n');

async function runTest() {
  const testUsername = 'zomato';
  const testHashtag = 'foodblogger';

  console.log('--- Instagram Adapter Manual Test ---');

  try {
    // 1. Test Profile Lookup
    console.log(`\n1. Testing Profile Lookup for: ${testUsername}...`);
    const profile = await instagramAdapter.getProfile(testUsername);
    console.log('Result:', JSON.stringify(profile, null, 2));

    // 2. Test Hashtag Search
    console.log(`\n2. Testing Hashtag Search for: #${testHashtag}...`);
    const searchResults = await instagramAdapter.searchByHashtag(testHashtag);
    console.log(`Found ${Array.isArray(searchResults) ? searchResults.length : 'some'} results.`);

    if (searchResults && typeof searchResults === 'object') {
      console.log('Search response received (raw data requested).');
    }

    console.log('\n✅ Manual test completed successfully.');
  } catch (error: any) {
    console.error('\n❌ Manual test failed:');
    console.error(error.message);
  }
}

// Run the test
runTest();