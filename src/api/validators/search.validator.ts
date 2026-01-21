import Joi from 'joi';

export const searchSchema = Joi.object({
    platform: Joi.string().valid('YOUTUBE', 'INSTAGRAM').optional(),
    location: Joi.string().optional(),

    minFollowers: Joi.number().min(0).optional(),
    maxFollowers: Joi.number().min(0).optional(),

    keyword: Joi.string().optional(),

    sortBy: Joi.string()
        .valid('followers', 'engagement', 'quality_score')
        .optional(),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional(),

    cursor: Joi.string().optional(),
    limit: Joi.number().min(1).max(100).optional(),
});