import { extractCuisines } from '../services/contentClassification.service';

const cuisineText =
  'I love biryani, dosa and street food like vada pav';

console.log('Input Text:', cuisineText);
console.log('Detected Cuisines:', extractCuisines(cuisineText));


import { detectLanguages } from '../services/contentClassification.service';

const languageTestText =
  'I love street food aur biryani bahut tasty hai 😋';

console.log('Input Text:', languageTestText);
console.log('Detected Languages:', detectLanguages(languageTestText));

import { extractLocations } from '../services/contentClassification.service';

const locationTestText =
  'Mumbai based food blogger | Street food from India';

console.log('Input Text:', locationTestText);
console.log('Detected Locations:', extractLocations(locationTestText));