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
exports.updateApplicationStatus = exports.getApplications = exports.submitApplication = exports.toggleApplicationConfig = exports.getApplicationConfig = void 0;
const db_1 = require("../db");
const getApplicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let config = yield db_1.prisma.applicationConfig.findUnique({ where: { id: "config" } });
        if (!config) {
            config = yield db_1.prisma.applicationConfig.create({
                data: { id: "config", isOpen: false }
            });
        }
        res.json({ isOpen: config.isOpen });
    }
    catch (error) {
        console.error("Error getting config:", error);
        res.status(500).json({ error: "Failed to fetch application config" });
    }
});
exports.getApplicationConfig = getApplicationConfig;
const toggleApplicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isOpen } = req.body;
        // ensure config exists first
        yield db_1.prisma.applicationConfig.upsert({
            where: { id: "config" },
            update: { isOpen },
            create: { id: "config", isOpen }
        });
        res.json({ success: true, isOpen });
    }
    catch (error) {
        console.error("Error toggling config:", error);
        res.status(500).json({ error: "Failed to update configuration" });
    }
});
exports.toggleApplicationConfig = toggleApplicationConfig;
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phone, department, batch, reason } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // Check if applications are open
        const config = yield db_1.prisma.applicationConfig.findUnique({ where: { id: "config" } });
        if (!config || !config.isOpen) {
            return res.status(403).json({ error: "Applications are currently closed" });
        }
        // Check for existing application by this user or email
        if (userId) {
            const existing = yield db_1.prisma.application.findFirst({ where: { userId } });
            if (existing)
                return res.status(400).json({ error: "You have already applied." });
        }
        const existingEmail = yield db_1.prisma.application.findFirst({ where: { email } });
        if (existingEmail)
            return res.status(400).json({ error: "An application with this email already exists." });
        const application = yield db_1.prisma.application.create({
            data: {
                name,
                email,
                phone,
                department,
                batch,
                reason,
                userId: userId || null
            }
        });
        res.status(201).json({ success: true, application });
    }
    catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
});
exports.submitApplication = submitApplication;
const getApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield db_1.prisma.application.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { profileImage: true } } }
        });
        res.json(applications);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});
exports.getApplications = getApplications;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED, REJECTED, PENDING
        const application = yield db_1.prisma.application.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, application });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
