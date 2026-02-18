import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';

/**
 * POST /api/v1/auth/register
 */
export const registerController = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }

        // Password validation (min 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user (firstName and lastName are accepted but not stored in current schema)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        console.log('✅ REGISTRATION SUCCESS:', email);

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('🔥 REGISTRATION ERROR:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Registration failed'
        });
    }
};

/**
 * GET /api/v1/auth/me
 */
export const getMeController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId; // Set by auth middleware

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('🔥 GET ME ERROR:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user data'
        });
    }
};

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