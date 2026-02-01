"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksController_1 = require("../controllers/tasksController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * MEMBER
 */
router.post("/createTask", authMiddleware_1.authenticateJwt, tasksController_1.createTask);
router.get("/getTasks", authMiddleware_1.authenticateJwt, tasksController_1.getTasks);
router.patch("/:id/status", authMiddleware_1.authenticateJwt, tasksController_1.updateTaskStatus);
/**
 * ADMIN / STUDENT
 */
router.patch("/:id/assign", authMiddleware_1.authenticateJwt);
exports.default = router;
