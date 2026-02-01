"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getAllBlogsAdmin = exports.getBlogs = void 0;
const db_1 = require("../db");
const cloudinary_1 = __importDefault(require("cloudinary"));
/* ======================================================
   PUBLIC: GET BLOGS
 ====================================================== */
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield db_1.prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    }
    catch (error) {
        console.error("Failed to fetch blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});
exports.getBlogs = getBlogs;
/* ======================================================
   ADMIN: GET ALL BLOGS
 ====================================================== */
const getAllBlogsAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield db_1.prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    }
    catch (error) {
        console.error("Failed to fetch admin blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});
exports.getAllBlogsAdmin = getAllBlogsAdmin;
/* ======================================================
   GET BLOG BY ID
 ====================================================== */
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield db_1.prisma.blog.findUnique({
            where: { id },
        });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(blog);
    }
    catch (error) {
        console.error("Failed to fetch blog:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getBlogById = getBlogById;
/* ======================================================
   CREATE BLOG
 ====================================================== */
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const files = req.files;
        const imageUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = yield cloudinary_1.default.v2.uploader.upload(file.path, { folder: "blogs" });
                imageUrls.push(uploadResult.secure_url);
            }
        }
        const blog = yield db_1.prisma.blog.create({
            data: {
                title,
                content,
                category,
                imageUrls,
            },
        });
        res.status(201).json(blog);
    }
    catch (error) {
        console.error("Failed to create blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
});
exports.createBlog = createBlog;
/* ======================================================
   UPDATE BLOG
 ====================================================== */
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, content, category, existingImages } = req.body;
        let imageUrls = [];
        // Parse existing images if they exist
        if (existingImages) {
            imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        const files = req.files;
        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = yield cloudinary_1.default.v2.uploader.upload(file.path, { folder: "blogs" });
                imageUrls.push(uploadResult.secure_url);
            }
        }
        const blog = yield db_1.prisma.blog.update({
            where: { id },
            data: {
                title,
                content,
                category,
                imageUrls,
            },
        });
        res.json(blog);
    }
    catch (error) {
        console.error("Failed to update blog:", error);
        res.status(500).json({ error: "Failed to update blog" });
    }
});
exports.updateBlog = updateBlog;
/* ======================================================
   DELETE BLOG
 ====================================================== */
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.blog.delete({
            where: { id },
        });
        res.json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error("Failed to delete blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
});
exports.deleteBlog = deleteBlog;
