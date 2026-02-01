"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const applicationController_1 = require("../controllers/applicationController");
const router = express_1.default.Router();
// Public/Student routes
router.get('/config', applicationController_1.getApplicationConfig);
router.post('/apply', applicationController_1.submitApplication); // Public access
// Admin routes
router.post('/config', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, applicationController_1.toggleApplicationConfig);
router.get('/all', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, applicationController_1.getApplications);
router.patch('/:id/status', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, applicationController_1.updateApplicationStatus);
exports.default = router;
