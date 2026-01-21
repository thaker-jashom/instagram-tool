import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendError } from '../../utils/httpResponse';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return sendError(res, 400, error.details[0].message);
        }
        next();
    };
};
