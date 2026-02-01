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
exports.deleteGuide = exports.updateGuide = exports.createGuide = exports.getGuideById = exports.getGuides = void 0;
const db_1 = require("../db");
const getGuides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const guides = yield db_1.prisma.guide.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(guides);
    }
    catch (error) {
        console.error('Failed to fetch guides:', error);
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
});
exports.getGuides = getGuides;
const getGuideById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const guide = yield db_1.prisma.guide.findUnique({
            where: { id },
        });
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.json(guide);
    }
    catch (error) {
        console.error('Failed to fetch guide:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getGuideById = getGuideById;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const createGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        let video = req.body.video;
        if (req.file) {
            // Upload video to Cloudinary
            const uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "kts_guides"
            });
            video = uploadResult.secure_url;
        }
        if (!video) {
            return res.status(400).json({ error: 'Video is required' });
        }
        const guide = yield db_1.prisma.guide.create({
            data: {
                title,
                description,
                video,
            },
        });
        res.status(201).json(guide);
    }
    catch (error) {
        console.error('Failed to create guide:', error);
        res.status(500).json({ error: 'Failed to create guide' });
    }
});
exports.createGuide = createGuide;
const updateGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        let video = req.body.video;
        if (req.file) {
            const uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "kts_guides"
            });
            video = uploadResult.secure_url;
        }
        const guide = yield db_1.prisma.guide.update({
            where: { id },
            data: {
                title,
                description,
                video,
            },
        });
        res.json(guide);
    }
    catch (error) {
        console.error('Failed to update guide:', error);
        res.status(500).json({ error: 'Failed to update guide' });
    }
});
exports.updateGuide = updateGuide;
const deleteGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.guide.delete({
            where: { id },
        });
        res.json({ message: 'Guide deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete guide:', error);
        res.status(500).json({ error: 'Failed to delete guide' });
    }
});
exports.deleteGuide = deleteGuide;
