import { Request, Response } from "express";
import { prisma } from "../db";
import cloudinary from "cloudinary";

export const getBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await (prisma as any).blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

export const getAllBlogsAdmin = async (_req: Request, res: Response) => {
    try {
        const blogs = await (prisma as any).blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    } catch (error) {
        console.error("Failed to fetch admin blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};



export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await (prisma as any).blog.findUnique({
            where: { id },
        });

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(blog);
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/* ======================================================
   CREATE BLOG
 ====================================================== */
export const createBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const files = req.files as Express.Multer.File[];
        const imageUrls: string[] = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = await cloudinary.v2.uploader.upload(file.path, { folder: "blogs" });
                imageUrls.push(uploadResult.secure_url);
            }
        }

        const blog = await (prisma as any).blog.create({
            data: {
                title,
                content,
                category,
                imageUrls,
            },
        });

        res.status(201).json(blog);
    } catch (error) {
        console.error("Failed to create blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
};

/* ======================================================
   UPDATE BLOG
 ====================================================== */
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category, existingImages } = req.body;

        let imageUrls: string[] = [];

        // Parse existing images if they exist
        if (existingImages) {
            imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = await cloudinary.v2.uploader.upload(file.path, { folder: "blogs" });
                imageUrls.push(uploadResult.secure_url);
            }
        }

        const blog = await (prisma as any).blog.update({
            where: { id },
            data: {
                title,
                content,
                category,
                imageUrls,
            },
        });

        res.json(blog);
    } catch (error) {
        console.error("Failed to update blog:", error);
        res.status(500).json({ error: "Failed to update blog" });
    }
};

/* ======================================================
   DELETE BLOG
 ====================================================== */
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await (prisma as any).blog.delete({
            where: { id },
        });

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Failed to delete blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
};
