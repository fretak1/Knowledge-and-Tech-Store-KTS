"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route
router.post('/sendMessages', authMiddleware_1.authenticateJwt, messageController_1.createMessage);
// Admin routes (add authentication middleware as needed)
router.get('/getMessages', authMiddleware_1.authenticateJwt, messageController_1.getMessages);
router.get('/getUnreadCount', authMiddleware_1.authenticateJwt, messageController_1.getUnreadCount);
router.get('/getMessageById/:id', authMiddleware_1.authenticateJwt, messageController_1.getMessageById);
router.patch('/markAllAsRead', authMiddleware_1.authenticateJwt, messageController_1.markAllAsRead);
router.delete('/deleteMessage/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, messageController_1.deleteMessage);
exports.default = router;
