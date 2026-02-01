import { Router } from "express";
import {
    getBlogs,
    getBlogById,
    getAllBlogsAdmin,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../controllers/blogController";
import { upload } from "../lib/upload";
import { adminOnly, authenticateJwt } from "../middleware/authMiddleware";

const router = Router();


router.get("/", getBlogs);
router.get("/:id", getBlogById);


router.get("/admin/all", authenticateJwt, getAllBlogsAdmin);
router.post("/createBlog",authenticateJwt, adminOnly, upload.array("images", 5), createBlog); // Allow up to 5 images
router.put("/updateBlog/:id", authenticateJwt, adminOnly, upload.array("images", 5), updateBlog);
router.delete("/deleteBlog/:id", authenticateJwt, adminOnly, deleteBlog);

export default router;
