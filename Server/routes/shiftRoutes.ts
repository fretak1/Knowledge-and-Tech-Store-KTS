import express from 'express';
import { authenticateJwt, adminOnly } from '../middleware/authMiddleware';
import {
    createShift,
    createRecurringShift,
    getShifts,
    getRecurringShifts,
    updateShift,
    deleteShift,
    deleteRecurringShift
} from '../controllers/shiftController';

const router = express.Router();

// Public/Member routes (view only)
router.get('/', authenticateJwt, getShifts);
router.get('/recurring', authenticateJwt, getRecurringShifts); // Use authenticateJwt for consistency, maybe public if needed? user said "admin tasks", usually protected.

// Admin routes (manage)
router.post('/', authenticateJwt, adminOnly, createShift);
router.post('/recurring', authenticateJwt, adminOnly, createRecurringShift);
router.patch('/:id', authenticateJwt, adminOnly, updateShift);
router.delete('/recurring/:id', authenticateJwt, adminOnly, deleteRecurringShift);
router.delete('/:id', authenticateJwt, adminOnly, deleteShift);

export default router;
