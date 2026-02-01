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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.deleteMessage = exports.markAllAsRead = exports.createMessage = exports.getMessageById = exports.getMessages = void 0;
const db_1 = require("../db");
// Get all messages (admin only)
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield db_1.prisma.message.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(messages);
    }
    catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getMessages = getMessages;
// Get message by ID (admin only)
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield db_1.prisma.message.findUnique({
            where: { id },
        });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(message);
    }
    catch (error) {
        console.error('Failed to fetch message:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});
exports.getMessageById = getMessageById;
// Create new message (public endpoint)
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, message } = req.body;
        if (!name || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }
        const newMessage = yield db_1.prisma.message.create({
            data: {
                name,
                message,
            },
        });
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error('Failed to create message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});
exports.createMessage = createMessage;
// Update message status (admin only)
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let result;
        if (user.role === "MEMBER") {
            result = yield db_1.prisma.message.updateMany({
                where: {
                    statusForMember: "UNREAD",
                },
                data: {
                    statusForMember: "READ",
                },
            });
        }
        else if (user.role === "ADMIN") {
            result = yield db_1.prisma.message.updateMany({
                where: {
                    statusForAdmin: "UNREAD",
                },
                data: {
                    statusForAdmin: "READ",
                },
            });
        }
        else {
            return res.status(403).json({ error: "Invalid role" });
        }
        res.json({
            role: user.role,
        });
    }
    catch (error) {
        console.error("Failed to mark messages as read:", error);
        res.status(500).json({ error: "Failed to update messages" });
    }
});
exports.markAllAsRead = markAllAsRead;
// Delete message (admin only)
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.message.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to delete message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});
exports.deleteMessage = deleteMessage;
// Get unread count (admin only)
const getUnreadCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let count = 0;
        if (user.role === "MEMBER") {
            count = yield db_1.prisma.message.count({
                where: {
                    statusForMember: "UNREAD",
                },
            });
        }
        else if (user.role === "ADMIN") {
            count = yield db_1.prisma.message.count({
                where: {
                    statusForAdmin: "UNREAD",
                },
            });
        }
        else {
            return res.status(403).json({ error: "Invalid role" });
        }
        res.json({
            role: user.role,
            count,
        });
    }
    catch (error) {
        console.error("Failed to get unread count:", error);
        res.status(500).json({ error: "Failed to get unread count" });
    }
});
exports.getUnreadCount = getUnreadCount;
