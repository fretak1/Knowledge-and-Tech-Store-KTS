import { Request, Response } from "express";
import { prisma } from "../db";
import cloudinary from "cloudinary";



export const getEvents = async (req: Request, res: Response) => {
    try {


        const events = await prisma.event.findMany({

            orderBy: {
                date: "asc",
            },
        });


        res.json(events);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};



export const getAllEventsAdmin = async (_req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(events);
    } catch (error) {
        console.error("Failed to fetch admin events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};



export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        console.error("Failed to fetch event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, location, type } = req.body;

        if (!title || !date) {
            return res.status(400).json({ error: "Title and date are required" });
        }

        const file = req.file as Express.Multer.File

        // Upload images to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(file.path, { folder: "events" })

        const bannerImage = uploadResult.secure_url;

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                type,
                imageUrl: bannerImage,
            },
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("Failed to create event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
};



export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, date, imageUrl, location, type, published } = req.body;

        let bannerImage = imageUrl; // ✅ keep existing image

        // ✅ only upload if a NEW image file is sent
        if (req.file) {
            const uploadResult = await cloudinary.v2.uploader.upload(
                req.file.path,
                { folder: "events" }
            );
            bannerImage = uploadResult.secure_url;
        }




        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                location,
                type,
                date: date ? new Date(date) : undefined,
                imageUrl: bannerImage,
            },
        });

        res.json(event);
    } catch (error) {
        console.error("Failed to update event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
};

/* ======================================================
   DELETE EVENT
====================================================== */
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.event.delete({
            where: { id },
        });

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Failed to delete event:", error);
        res.status(500).json({ error: "Failed to delete event" });
    }
};
