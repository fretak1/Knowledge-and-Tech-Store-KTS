import { Router } from 'express';
import {
    getMessages,
    getMessageById,
    createMessage,
    markAllAsRead,
    deleteMessage,
    getUnreadCount,
} from '../controllers/messageController';
import { adminOnly, authenticateJwt } from '../middleware/authMiddleware';

const router = Router();


router.post('/sendMessages', authenticateJwt, createMessage);


router.get('/getMessages', authenticateJwt, getMessages);
router.get('/getUnreadCount', authenticateJwt, getUnreadCount);
router.get('/getMessageById/:id', authenticateJwt, getMessageById);
router.patch('/markAllAsRead', authenticateJwt, markAllAsRead);
router.delete('/deleteMessage/:id', authenticateJwt,adminOnly, deleteMessage);

export default router;
