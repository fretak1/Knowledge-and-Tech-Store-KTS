"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysisController_1 = require("../controllers/analysisController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// /api/analysis/stats
router.get("/stats", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, analysisController_1.getAdminStats);
exports.default = router;
