import { Request, Response } from 'express';
import { prisma } from '../db';
import cloudinary from '../lib/cloudinary';


export const getGuides = async (req: Request, res: Response) => {
    try {

        const guides = await prisma.guide.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(guides);
    } catch (error) {
        console.error('Failed to fetch guides:', error);
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
};

export const getGuideById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const guide = await prisma.guide.findUnique({
            where: { id },
        });

        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }

        res.json(guide);
    } catch (error) {
        console.error('Failed to fetch guide:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const createGuide = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        let video = req.body.video;

        if (req.file) {
            // Upload video to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "kts_guides"
            });
            video = uploadResult.secure_url;
        }

        if (!video) {
            return res.status(400).json({ error: 'Video is required' });
        }

        const guide = await prisma.guide.create({
            data: {
                title,
                description,
                video,
            },
        });

        res.status(201).json(guide);
    } catch (error) {
        console.error('Failed to create guide:', error);
        res.status(500).json({ error: 'Failed to create guide' });
    }
};

export const updateGuide = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        let video = req.body.video;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "kts_guides"
            });
            video = uploadResult.secure_url;
        }

        const guide = await prisma.guide.update({
            where: { id },
            data: {
                title,
                description,
                video,
            },
        });

        res.json(guide);
    } catch (error) {
        console.error('Failed to update guide:', error);
        res.status(500).json({ error: 'Failed to update guide' });
    }
};

export const deleteGuide = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.guide.delete({
            where: { id },
        });

        res.json({ message: 'Guide deleted successfully' });
    } catch (error) {
        console.error('Failed to delete guide:', error);
        res.status(500).json({ error: 'Failed to delete guide' });
    }
};
