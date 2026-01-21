/* ---------------- CATEGORIES ---------------- */

export function extractCategories(text?: string | null): string[] {
    if (!text) return [];
    const t = text.toLowerCase();
    const categories = new Set<string>();

    if (t.includes('street')) categories.add('street_food');
    if (t.includes('biryani') || t.includes('dosa')) categories.add('indian_food');
    if (t.includes('pizza') || t.includes('burger')) categories.add('fast_food');

    return Array.from(categories);
}

/* ---------------- CUISINES ---------------- */

export function extractCuisines(text?: string | null): string[] {
    if (!text) return [];
    const t = text.toLowerCase();
    const cuisines = new Set<string>();

    if (t.includes('biryani')) cuisines.add('north_indian');
    if (t.includes('dosa') || t.includes('idli')) cuisines.add('south_indian');
    if (t.includes('vada pav')) cuisines.add('street_food');

    return Array.from(cuisines);
}

// alias for compatibility
export const detectCuisines = extractCuisines;

/* ---------------- LANGUAGES ---------------- */

export function detectLanguages(text?: string | null): string[] {
    if (!text) return [];
    const langs = new Set<string>();

    if (/[a-zA-Z]/.test(text)) langs.add('english');
    if (/[हिंदी]|hai|aur|bahut/.test(text.toLowerCase()))
        langs.add('hinglish');

    return Array.from(langs);
}

/* ---------------- LOCATIONS ---------------- */

export function extractLocations(text?: string | null): {
  city?: string;
  state?: string;
  country?: string;
} {
  if (!text) return {};

  const lower = text.toLowerCase();

  // Minimal Indian city mapping (HR-friendly)
  if (lower.includes('mumbai')) {
    return { city: 'Mumbai', state: 'Maharashtra', country: 'IN' };
  }

  if (lower.includes('delhi')) {
    return { city: 'Delhi', state: 'Delhi', country: 'IN' };
  }

  if (lower.includes('bangalore')) {
    return { city: 'Bangalore', state: 'Karnataka', country: 'IN' };
  }

  // fallback
  if (lower.includes('india')) {
    return { country: 'IN' };
  }

  return {};
}