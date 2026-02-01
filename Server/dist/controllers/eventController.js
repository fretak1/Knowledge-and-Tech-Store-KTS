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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEventsAdmin = exports.getEvents = void 0;
const db_1 = require("../db");
const cloudinary_1 = __importDefault(require("cloudinary"));
/* ======================================================
   PUBLIC: GET EVENTS (Published only)
====================================================== */
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield db_1.prisma.event.findMany({
            orderBy: {
                date: "asc",
            },
        });
        res.json(events);
    }
    catch (error) {
        console.error("Failed to fetch events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});
exports.getEvents = getEvents;
/* ======================================================
   ADMIN: GET ALL EVENTS (Published + Drafts)
====================================================== */
const getAllEventsAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield db_1.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(events);
    }
    catch (error) {
        console.error("Failed to fetch admin events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});
exports.getAllEventsAdmin = getAllEventsAdmin;
/* ======================================================
   GET EVENT BY ID
====================================================== */
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield db_1.prisma.event.findUnique({
            where: { id },
        });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    }
    catch (error) {
        console.error("Failed to fetch event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getEventById = getEventById;
/* ======================================================
   CREATE EVENT
====================================================== */
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, date, location, type } = req.body;
        if (!title || !date) {
            return res.status(400).json({ error: "Title and date are required" });
        }
        const file = req.file;
        // Upload images to Cloudinary
        const uploadResult = yield cloudinary_1.default.v2.uploader.upload(file.path, { folder: "events" });
        const bannerImage = uploadResult.secure_url;
        const event = yield db_1.prisma.event.create({
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
    }
    catch (error) {
        console.error("Failed to create event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
});
exports.createEvent = createEvent;
/* ======================================================
   UPDATE EVENT
====================================================== */
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, date, imageUrl, location, type, published } = req.body;
        let bannerImage = imageUrl; // ✅ keep existing image
        // ✅ only upload if a NEW image file is sent
        if (req.file) {
            const uploadResult = yield cloudinary_1.default.v2.uploader.upload(req.file.path, { folder: "events" });
            bannerImage = uploadResult.secure_url;
        }
        const event = yield db_1.prisma.event.update({
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
    }
    catch (error) {
        console.error("Failed to update event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
});
exports.updateEvent = updateEvent;
/* ======================================================
   DELETE EVENT
====================================================== */
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.event.delete({
            where: { id },
        });
        res.json({ message: "Event deleted successfully" });
    }
    catch (error) {
        console.error("Failed to delete event:", error);
        res.status(500).json({ error: "Failed to delete event" });
    }
});
exports.deleteEvent = deleteEvent;
