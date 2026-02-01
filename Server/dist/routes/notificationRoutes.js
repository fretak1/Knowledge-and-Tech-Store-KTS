"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/get', authMiddleware_1.authenticateJwt, notificationController_1.getNotifications);
router.patch('/markAllAsRead', authMiddleware_1.authenticateJwt, notificationController_1.markAllAsRead);
exports.default = router;
