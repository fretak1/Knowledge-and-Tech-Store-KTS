import { Router } from 'express';
import { getGuides, getGuideById, createGuide, updateGuide, deleteGuide } from '../controllers/guideController';
import { adminOnly, authenticateJwt } from '../middleware/authMiddleware';
import { upload } from '../lib/upload';


const router = Router();


router.get('/', getGuides);
router.get('/:id', getGuideById);



router.post('/createGuide', authenticateJwt, adminOnly, upload.single("video"), createGuide);
router.put('/updateGuide/:id', authenticateJwt, adminOnly, upload.single("video"), updateGuide);
router.delete('/deleteGuide/:id', authenticateJwt, adminOnly, deleteGuide);

export default router;
