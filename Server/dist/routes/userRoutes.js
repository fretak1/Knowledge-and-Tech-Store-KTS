"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const upload_1 = require("../lib/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public
router.get('/getMembers', userController_1.getMembers);
router.get('/getStudents', userController_1.getStudents);
router.get('/getAllUsers', userController_1.getAllUsers);
// Protected (Admin only)
router.post('/registerStudent', authMiddleware_1.authenticateJwt, userController_1.registerStudent);
router.post('/registerMember', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.single("profileImage"), userController_1.registerMember);
router.delete('/deleteMember/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, userController_1.deleteMember);
// Protected (Authenticated users)
router.put('/profile', authMiddleware_1.authenticateJwt, upload_1.upload.single("profileImage"), userController_1.updateProfile);
router.get('/students/search', authMiddleware_1.authenticateJwt, userController_1.searchStudents);
exports.default = router;
