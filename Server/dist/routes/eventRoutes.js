"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const upload_1 = require("../lib/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/* ---------------- PUBLIC ROUTES ---------------- */
router.get("/", eventController_1.getEvents);
router.get("/:id", eventController_1.getEventById);
/* ---------------- ADMIN ROUTES ---------------- */
// router.use(adminAuth); // enable when ready
router.get("/admin/all", eventController_1.getAllEventsAdmin);
router.post("/createEvent", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.single("image"), eventController_1.createEvent);
router.put("/updateEvent/:id", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.single("image"), eventController_1.updateEvent);
router.delete("/deleteEvent/:id", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, eventController_1.deleteEvent);
exports.default = router;
