"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const shiftController_1 = require("../controllers/shiftController");
const router = express_1.default.Router();
// Public/Member routes (view only)
router.get('/', authMiddleware_1.authenticateJwt, shiftController_1.getShifts);
router.get('/recurring', authMiddleware_1.authenticateJwt, shiftController_1.getRecurringShifts); // Use authenticateJwt for consistency, maybe public if needed? user said "admin tasks", usually protected.
// Admin routes (manage)
router.post('/', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, shiftController_1.createShift);
router.post('/recurring', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, shiftController_1.createRecurringShift);
router.patch('/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, shiftController_1.updateShift);
router.delete('/recurring/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, shiftController_1.deleteRecurringShift);
router.delete('/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, shiftController_1.deleteShift);
exports.default = router;
