export function calculateEngagementRate(
    likes: number,
    comments: number,
    followers: number
): number {
    if (!followers || followers === 0) return 0;
    return Number(((likes + comments) / followers).toFixed(4));
}

export function calculateQualityScore(
    followers: number,
    engagementRate: number,
    postsCount: number
): number {
    let score = 0;

    if (followers > 100000) score += 4;
    else if (followers > 10000) score += 3;
    else score += 2;

    if (engagementRate > 0.05) score += 4;
    else if (engagementRate > 0.02) score += 3;
    else score += 1;

    if (postsCount > 100) score += 2;
    else if (postsCount > 20) score += 1;

    // 🔐 NORMALIZE TO 0–10 (CRITICAL FIX)
    const normalizedScore = Math.min(Number((score / 10).toFixed(2)), 9.99);

    return normalizedScore;
}