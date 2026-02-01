import { Request, Response } from 'express';
import { prisma } from '../db';

export const getApplication = async (req: Request, res: Response) => {
    try {
        let appData = await prisma.applicationConfig.findUnique({ where: { id: "config" } });
        if (!appData) {
            appData = await prisma.applicationConfig.create({
                data: { id: "config", isOpen: false }
            });
        }
        res.json({ isOpen: appData.isOpen });
    } catch (error) {
        console.error("Error getting application info:", error);
        res.status(500).json({ error: "Failed to fetch application info" });
    }
};

export const toggleApplication = async (req: Request, res: Response) => {
    try {
        const { isOpen } = req.body;
        // ensure record exists first
        await prisma.applicationConfig.upsert({
            where: { id: "config" },
            update: { isOpen },
            create: { id: "config", isOpen }
        });
        res.json({ success: true, isOpen });
    } catch (error) {
        console.error("Error toggling application:", error);
        res.status(500).json({ error: "Failed to update" });
    }
};

export const submitApplication = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, department, batch, reason } = req.body;
        const userId = (req as any).user?.userId;

        // Check if applications are open
        const appData = await prisma.applicationConfig.findUnique({ where: { id: "config" } });
        if (!appData || !appData.isOpen) {
            return res.status(403).json({ error: "Applications are currently closed" });
        }

        // Check for existing application by this user or email
        if (userId) {
            const existing = await prisma.application.findFirst({ where: { userId } });
            if (existing) return res.status(400).json({ error: "You have already applied." });
        }
        const existingEmail = await prisma.application.findFirst({ where: { email } });
        if (existingEmail) return res.status(400).json({ error: "An application with this email already exists." });

        const application = await prisma.application.create({
            data: {
                name,
                email,
                phone,
                department,
                batch,
                reason,
                userId: userId || null
            }
        });

        res.status(201).json({ success: true, application });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
};

export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { profileImage: true } } }
        });
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};

