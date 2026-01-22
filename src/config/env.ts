import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),

    PORT: Joi.number().default(3000),

    // 🔴 Database is OPTIONAL for now
    DATABASE_URL: Joi.string().optional(),

    // 🔴 Redis is OPTIONAL
    REDIS_URL: Joi.string().optional(),

    // Keep other vars as-is
}).unknown(true);

const { value, error } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}

export const config = {
    env: value.NODE_ENV,
    port: value.PORT,
    databaseUrl: value.DATABASE_URL,
    redisUrl: value.REDIS_URL,
    logLevel: value.LOG_LEVEL
};