import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true
        });

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        next();
    };
};