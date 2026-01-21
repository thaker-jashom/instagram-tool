import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info')
}).unknown();

const { value, error } = schema.validate(process.env);

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