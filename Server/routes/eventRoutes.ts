import { Router } from "express";
import {
    getEvents,
    getEventById,
    getAllEventsAdmin,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController";
import { upload } from "../lib/upload";
import { adminOnly, authenticateJwt } from "../middleware/authMiddleware";

const router = Router();


router.get("/", getEvents);
router.get("/:id", getEventById);



router.get("/admin/all", getAllEventsAdmin);
router.post("/createEvent", authenticateJwt, adminOnly, upload.single("image"), createEvent);
router.put("/updateEvent/:id", authenticateJwt, adminOnly, upload.single("image"), updateEvent);
router.delete("/deleteEvent/:id", authenticateJwt, adminOnly, deleteEvent);

export default router;
