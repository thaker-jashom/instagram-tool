export const generateCacheKey = (prefix: string, payload: unknown) => {
    return `${prefix}:${JSON.stringify(payload)}`;
};

export async function getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = 60
): Promise<T> {
    // Redis removed - execute fetcher directly
    return await fetcher();
}