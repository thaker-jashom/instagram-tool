import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        logger.info('PostgreSQL connected via Prisma');
    })
    .catch((error) => {
        logger.error('Prisma connection error:', error);
        process.exit(1);
    });

export default prisma;