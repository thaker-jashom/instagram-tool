import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

export const getHealth = async (_: Request, res: Response) => {
    const dbOk = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
    const redisOk = redis.status === 'ready';

    res.status(dbOk && redisOk ? 200 : 503).json({
        status: dbOk && redisOk ? 'OK' : 'DEGRADED',
        uptime: process.uptime(),
        services: {
            database: dbOk ? 'connected' : 'down',
            redis: redisOk ? 'connected' : 'down'
        }
    });
};