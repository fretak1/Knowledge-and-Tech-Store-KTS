import { login, logout, getMe, getMember, forgotPassword, resetPassword, verifyResetCode } from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);
router.get('/members', getMember);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
