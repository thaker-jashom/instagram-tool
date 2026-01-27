import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';

/**
 * POST /api/v1/auth/login
 */
export const loginController = async (req: Request, res: Response) => {
    try {
        /* 🔍 DEBUG LOGS (TEMPORARY) */
        console.log('LOGIN BODY >>>', req.body);

        const { email, password } = req.body;
        console.log('EMAIL RECEIVED >>>', email);

        if (!email || !password) {
            console.log('❌ Email or password missing');
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        console.log('USER FOUND >>>', user);

        if (!user) {
            console.log('❌ No user found with this email');
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log('PASSWORD MATCH >>>', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Password does not match');
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' } 
          );
          
        console.log('✅ LOGIN SUCCESS');

        return res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('🔥 LOGIN ERROR:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Login failed'
        });
    }
};