import { Worker, WorkerOptions, Job } from 'bullmq';
import { queueConfig } from '../../config/queue';
import logger from '../../utils/logger';

export abstract class BaseWorker<T> {
    private worker: Worker<T>;

    constructor(name: string, options?: WorkerOptions) {
        this.worker = new Worker<T>(
            name,
            async (job: Job) => {
                try {
                    logger.info(`Processing job ${job.id} in ${name}`);
                    await this.process(job);
                    logger.info(`Job ${job.id} completed in ${name}`);
                } catch (error) {
                    logger.error(`Job ${job.id} failed in ${name}:`, error);
                    throw error;
                }
            },
            {
                connection: queueConfig,
                ...options,
            }
        );

        this.worker.on('failed', (job, err) => {
            logger.error(`Worker ${name} error for job ${job?.id}:`, err);
        });
    }

    abstract process(job: Job<T>): Promise<void>;

    public close() {
        return this.worker.close();
    }
}
