import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import crypto from 'crypto';
import { sendEmail } from '../lib/sendEmail';
import { addDays, differenceInDays, format, isSameDay, parseISO, startOfDay } from 'date-fns';


// Login User
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '60m' }
        );

      res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: true,        // MUST be true
  sameSite: 'none',    // MUST be 'none' for cross-site
  maxAge: 60 * 60 * 1000,
});


        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department,
                batch: user.batch,
                github: user.github,
                linkedin: user.linkedin,
                telegram: user.telegram,
                profileImage: user.profileImage,
            },
            accessToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
};

// Get Current User (Me)
export const getMe = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                department: true,
                batch: true,
                github: true,
                linkedin: true,
                telegram: true,
                profileImage: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


export const getMember = async (req: Request, res: Response) => {
    try {
        const members = await prisma.user.findMany({
            where: { role: 'MEMBER' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                batch: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                profileImage: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json({ user: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetCode, resetCodeExpires }
        });

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Password Reset Code</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Use the following 6-digit code to proceed:</p>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
                    ${resetCode}
                </div>
                <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="text-align: center; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} KTS. All rights reserved.</p>
            </div>
        `;

        await sendEmail(user.email, 'Your Password Reset Code', message);

        res.json({ success: true });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyResetCode = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Verify code error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, code, password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired code session' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetCode: null,
                resetCodeExpires: null
            }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



