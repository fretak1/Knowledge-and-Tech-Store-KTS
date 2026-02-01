import { Router } from 'express';
import { registerStudent, registerMember, getAllUsers, deleteMember, getStudents, searchStudents, getMembers, updateProfile } from '../controllers/userController';
import { upload } from '../lib/upload';
import { authenticateJwt, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Public
router.get('/getMembers', getMembers);
router.get('/getStudents', getStudents);
router.get('/getAllUsers', getAllUsers);

// Protected (Admin only)
router.post('/registerStudent', authenticateJwt, registerStudent);
router.post('/registerMember', authenticateJwt, adminOnly, upload.single("profileImage"), registerMember);
router.delete('/deleteMember/:id', authenticateJwt, adminOnly, deleteMember);

// Protected (Authenticated users)
router.put('/profile', authenticateJwt, upload.single("profileImage"), updateProfile);
router.get('/students/search', authenticateJwt, searchStudents);

export default router;


