import 'dotenv/config'; // MUST BE FIRST
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/database';
import logger from './utils/logger';

const start = async () => {
  try {
    // 🟢 Database (optional)
    if (process.env.DATABASE_URL) {
      try {
        await connectDB();
        logger.info('PostgreSQL connected');
      } catch (error) {
        logger.error('Failed to connect to PostgreSQL:', error);
        logger.warn('Continuing without database connection. Some features may not work.');
        // Don't exit - allow app to start without database
      }
    } else {
      logger.warn('DATABASE_URL not set — skipping database connection');
    }

    // Redis and queue workers removed - not required by HR document

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