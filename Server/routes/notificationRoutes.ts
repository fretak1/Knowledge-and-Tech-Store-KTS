import { Router } from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notificationController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();



router.get('/get', authenticateJwt, getNotifications);
router.patch('/markAllAsRead', authenticateJwt, markAllAsRead);

export default router;