import 'dotenv/config'; // MUST BE FIRST
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/database';
import './queues/workers/youtube.worker';
import './queues/workers/instagram.discovery.worker';
import './config/redis';
import logger from './utils/logger';

const start = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
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