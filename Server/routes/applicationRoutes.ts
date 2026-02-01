import express from 'express';
import { authenticateJwt, adminOnly } from '../middleware/authMiddleware';
import {
    getApplication,
    toggleApplication,
    submitApplication,
    getApplications,
} from '../controllers/applicationController';

const router = express.Router();

// Public/Student routes
router.get('/', getApplication);
router.post('/apply', submitApplication); // Public access

// Admin routes
router.post('/', authenticateJwt, adminOnly, toggleApplication);
router.get('/all', authenticateJwt, adminOnly, getApplications);

export default router;
