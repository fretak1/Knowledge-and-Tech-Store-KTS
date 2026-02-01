"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guideController_1 = require("../controllers/guideController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../lib/upload");
const router = (0, express_1.Router)();
/* ---------------- PUBLIC ROUTES ---------------- */
router.get('/', guideController_1.getGuides);
router.get('/:id', guideController_1.getGuideById);
/* ---------------- ADMIN ROUTES ---------------- */
router.post('/createGuide', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.single("video"), guideController_1.createGuide);
router.put('/updateGuide/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.single("video"), guideController_1.updateGuide);
router.delete('/deleteGuide/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, guideController_1.deleteGuide);
exports.default = router;
