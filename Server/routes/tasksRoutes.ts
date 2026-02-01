import { Router } from "express";
import {
    createTask,
    getTasks,
    updateTaskStatus,
} from "../controllers/tasksController";
import { authenticateJwt } from "../middleware/authMiddleware";

const router = Router();


/**
 * MEMBER
 */

router.post(
    "/createTask",
    authenticateJwt,
    createTask
);

router.get(
    "/getTasks",
    authenticateJwt,
    getTasks
);



router.patch(
    "/:id/status",
    authenticateJwt,
    updateTaskStatus
);

/**
 * ADMIN / STUDENT
 */
router.patch(
    "/:id/assign",
    authenticateJwt,
);

export default router;
