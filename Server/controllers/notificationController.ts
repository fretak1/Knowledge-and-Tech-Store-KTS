import { Request, Response } from 'express';
import { prisma } from '../db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';




// Get all notifications for the logged-in user
export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId; // Assumes your auth middleware attaches user to req

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};



// Mark a specific notification as read
export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
