import { Request, Response } from "express";
import { AuthenticatedRequest } from "@server/middleware/authMiddleware";
import { prisma } from '../db';

/**
 * MEMBER → Create a task (service request)
 */
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, device, manufacturer, serialNumber, studentId } = req.body;
        const memberId = req.user?.userId; // from auth middleware

        const task = await prisma.task.create({
            data: {
                title,
                description,
                device: device || "PC",
                manufacturer: manufacturer || "Unknown",
                serialNumber: serialNumber || "N/A",
                memberId,
                studentId: studentId, // assigned later or by admin
            },
        });

        res.status(201).json({ data: task, success: true });
    } catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};



export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user; // from auth middleware

    let tasks;

    if (user?.role === 'STUDENT') {
        tasks = await prisma.task.findMany({
            where: { studentId: user.userId },
            select: {
                id: true,
                title: true,
                description: true,
                device: true,
                manufacturer: true,
                serialNumber: true,
                status: true,
                createdAt: true,
                member: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    else if (user?.role === 'MEMBER') {
        tasks = await prisma.task.findMany({
            where: { memberId: user.userId },
            include: {
                student: {
                    select: { id: true, name: true, department: true, batch: true },
                },
            },
        });
    }

    else if (user?.role === 'ADMIN') {
        tasks = await prisma.task.findMany({
            include: {
                student: true,
                member: true,
            },
        });
    }

    res.json(tasks);
};



/**
 * STUDENT → Update task status
 */
export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await prisma.task.update({
            where: { id },
            data: { status },
        });

        

        if (task.status === "COMPLETED") {
            await prisma.notification.create({
                data: {
                    userId: task.studentId,
                    message: `Great news! Your task "${task.title}" has been completed.`,
                },
            });
        }


        res.json({ data: task, success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task status" });
    }
};


