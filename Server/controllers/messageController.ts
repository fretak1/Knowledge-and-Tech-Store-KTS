import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../db';

// Get all messages (admin only)
export const getMessages = async (req: Request, res: Response) => {
    try {

        const messages = await prisma.message.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Get message by ID (admin only)
export const getMessageById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const message = await prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        console.error('Failed to fetch message:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
};

// Create new message (public endpoint)
export const createMessage = async (req: Request, res: Response) => {
    try {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const newMessage = await prisma.message.create({
            data: {
                name,
                message,
            },
        });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Failed to create message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
};

// Update message status (admin only)
export const markAllAsRead = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let result;

        if (user.role === "MEMBER") {
            result = await prisma.message.updateMany({
                where: {
                    statusForMember: "UNREAD",
                },
                data: {
                    statusForMember: "READ",
                },
            });
        }
        else if (user.role === "ADMIN") {
            result = await prisma.message.updateMany({
                where: {
                    statusForAdmin: "UNREAD",
                },
                data: {
                    statusForAdmin: "READ",
                },
            });
        }
        else {
            return res.status(403).json({ error: "Invalid role" });
        }

       res.json({
            role: user.role,
        });
    } catch (error) {
        console.error("Failed to mark messages as read:", error);
        res.status(500).json({ error: "Failed to update messages" });
    }
};

// Delete message (admin only)
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.message.delete({
            where: { id },
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Failed to delete message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

// Get unread count (admin only)
export const getUnreadCount = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let count = 0;

        if (user.role === "MEMBER") {
            count = await prisma.message.count({
                where: {
                    statusForMember: "UNREAD",
                },
            });
        }
        else if (user.role === "ADMIN") {
            count = await prisma.message.count({
                where: {
                    statusForAdmin: "UNREAD",
                },
            });
        }
        else {
            return res.status(403).json({ error: "Invalid role" });
        }

        res.json({
            role: user.role,
            count,
        });
    } catch (error) {
        console.error("Failed to get unread count:", error);
        res.status(500).json({ error: "Failed to get unread count" });
    }
};