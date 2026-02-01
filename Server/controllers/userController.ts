import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import cloudinary from '../lib/cloudinary';
import { AuthenticatedRequest } from '../middleware/authMiddleware';


export const registerStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, department, batch, phone } = req.body;

       

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash("1234", 10);

        await prisma.user.create({
            data: {
                name,
                email,
                department,
                batch,
                phone,
                passwordHash,
                role: 'STUDENT',
            },
        });

        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (error) {
        console.error('Register student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const registerMember = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            department,
            batch,
            phone,
            github,
            linkedin,
            telegram,
        } = req.body;

       

        const file = req.file as Express.Multer.File;
        let profileImage = "";

        if (file) {
            // Upload images to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, { folder: "kts_members" });
            profileImage = uploadResult.secure_url;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Member already exists' });
        }

        const passwordHash = await bcrypt.hash("kts1234", 10);

        await prisma.user.create({
            data: {
                name,
                email,
                profileImage,
                phone,
                department,
                batch,
                github,
                linkedin,
                telegram,
                passwordHash,
                role: 'MEMBER',
            },
        });

        res.status(201).json({ success: true, message: 'Member registered successfully' });
    } catch (error) {
        console.error('Register member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.user.findMany({
            where: { role: 'MEMBER' },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(members);
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

// Get Students (Public)
export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

// Update Profile (Protected)
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, phone, email, github, linkedin, telegram, department, batch, currentPassword, newPassword } = req.body;
        let profileImage = req.body.profileImage;

        if (email && email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "kts_profiles" });
            profileImage = uploadResult.secure_url;
        }

        let passwordHash = undefined;
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }

            const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
            if (!dbUser || !dbUser.passwordHash) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Incorrect current password' });
            }

            passwordHash = await bcrypt.hash(newPassword, 10);
        }

        const updateData: any = {
            name,
            phone,
            email,
            profileImage,
            github,
            linkedin,
            telegram,
            department,
            batch
        };

        if (passwordHash) {
            updateData.passwordHash = passwordHash;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileImage: true,
                phone: true,
                department: true,
                batch: true,
                github: true,
                linkedin: true,
                telegram: true
            }
        });

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const searchStudents = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const field = req.query.field as "name" | "department" | "batch";

    if (!q || q.length < 2) {
        return res.json([]);
    }

    // Validate field
    const searchField: "name" | "department" | "batch" =
        ["name", "department", "batch"].includes(field) ? field : "name";

    // Build dynamic where clause
    const whereClause: any = {
        role: "STUDENT",
        [searchField]: { contains: q, mode: "insensitive" },
    };

    const students = await prisma.user.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            department: true,
            email: true,
            phone: true,
            batch: true,
            profileImage: true,
        },
    });

    res.json(students);
};

export const deleteMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const member = await prisma.user.findUnique({
            where: { id },
        });

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Delete member error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ["MEMBER", "ADMIN"],
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
