"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const upload_1 = require("../lib/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/* ---------------- PUBLIC ROUTES ---------------- */
router.get("/", blogController_1.getBlogs);
router.get("/:id", blogController_1.getBlogById);
/* ---------------- ADMIN ROUTES ---------------- */
router.get("/admin/all", authMiddleware_1.authenticateJwt, blogController_1.getAllBlogsAdmin);
router.post("/createBlog", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.array("images", 5), blogController_1.createBlog); // Allow up to 5 images
router.put("/updateBlog/:id", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, upload_1.upload.array("images", 5), blogController_1.updateBlog);
router.delete("/deleteBlog/:id", authMiddleware_1.authenticateJwt, authMiddleware_1.adminOnly, blogController_1.deleteBlog);
exports.default = router;
