import 'dotenv/config'; // MUST BE FIRST
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/database';
import logger from './utils/logger';

const start = async () => {
  try {
    // 🟢 Database (optional)
    if (process.env.DATABASE_URL) {
      await connectDB();
      logger.info('PostgreSQL connected');
    } else {
      logger.warn('DATABASE_URL not set — skipping database connection');
    }

    // 🟢 Redis (optional)
    if (process.env.REDIS_URL) {
      const { initRedis } = await import('./config/redis');
      initRedis();
    } else {
      logger.warn('REDIS_URL not set — skipping Redis initialization');
    }

    // 🟢 Workers (only if Redis exists)
    if (process.env.REDIS_URL) {
      await import('./queues/workers/youtube.worker');
      await import('./queues/workers/instagram.discovery.worker');
      logger.info('Queue workers started');
    } else {
      logger.warn('Queue workers skipped (Redis not available)');
    }

    // 🟢 Start HTTP server no matter what
    app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.env} mode`
      );
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (err: any) => {
  logger.error('Unhandled rejection', err);
  process.exit(1);
});