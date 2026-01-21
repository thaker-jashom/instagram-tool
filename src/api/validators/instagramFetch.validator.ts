import Joi from 'joi';

export const instagramFetchValidator = Joi.object({
    hashtags: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required(),

    minFollowers: Joi.number().integer().min(0).optional(),
    maxFollowers: Joi.number().integer().min(0).optional(),

    location: Joi.object({
        city: Joi.string().optional(),
        country: Joi.string().optional()
    }).optional()
});