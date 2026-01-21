import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) => {
    console.log('--- AUTH MIDDLEWARE HIT ---');
    console.log('Headers:', req.headers);

    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
        console.log('❌ No Authorization header');
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        console.log('✅ Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('❌ JWT verification failed:', err);
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
};