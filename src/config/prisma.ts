import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../utils/logger';

// Define PrismaClient with log configuration
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
        ],
    });
};

// Singleton pattern for Prisma Client
const globalForPrisma = global as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton>
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

// Log queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e: Prisma.QueryEvent) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
    });
}

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// IMPORTANT: Do NOT call $connect() here
// Connection is handled by server.ts only if DATABASE_URL is set
// This allows the app to start even without DATABASE_URL

export default prisma;