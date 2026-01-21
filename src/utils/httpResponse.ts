import { Response } from 'express';

export const sendResponse = (
    res: Response,
    statusCode: number,
    data: any,
    message: string = 'Success'
) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string
) => {
    res.status(statusCode).json({
        status: 'error',
        message,
    });
};
