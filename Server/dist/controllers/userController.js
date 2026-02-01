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
exports.getAllUsers = exports.deleteMember = exports.searchStudents = exports.updateProfile = exports.getStudents = exports.getMembers = exports.registerMember = exports.registerStudent = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
// Register Student (Protected: Admin, Member)
const registerStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, department, batch, phone } = req.body;
        // Manual Validation
        const errors = {};
        if (!name || name.trim().length === 0)
            errors.name = { _errors: ["Name is required"] };
        if (!email || !/^\S+@\S+\.\S+$/.test(email))
            errors.email = { _errors: ["Invalid email"] };
        if (!department)
            errors.department = { _errors: ["Department is required"] };
        if (!batch)
            errors.batch = { _errors: ["Batch is required"] };
        if (!phone)
            errors.phone = { _errors: ["Phone is required"] };
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: { fieldErrors: errors } });
        }
        const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const passwordHash = yield bcryptjs_1.default.hash("1234", 10);
        yield db_1.prisma.user.create({
            data: {
                name,
                email,
                department,
                batch,
                phone,
                passwordHash,
                role: 'STUDENT',
            },
        });
        res.status(201).json({ success: true, message: 'Student registered successfully' });
    }
    catch (error) {
        console.error('Register student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerStudent = registerStudent;
// Register Member (Protected: Admin)
const registerMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, department, batch, phone, github, linkedin, telegram, } = req.body;
        // Manual Validation
        const errors = {};
        if (!name || name.trim().length === 0)
            errors.name = { _errors: ["Name is required"] };
        if (!email || !/^\S+@\S+\.\S+$/.test(email))
            errors.email = { _errors: ["Invalid email"] };
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: { fieldErrors: errors } });
        }
        const file = req.file;
        let profileImage = "";
        if (file) {
            // Upload images to Cloudinary
            const uploadResult = yield cloudinary_1.default.uploader.upload(file.path, { folder: "kts_members" });
            profileImage = uploadResult.secure_url;
        }
        const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Member already exists' });
        }
        const passwordHash = yield bcryptjs_1.default.hash("kts1234", 10);
        yield db_1.prisma.user.create({
            data: {
                name,
                email,
                profileImage,
                phone,
                department,
                batch,
                github,
                linkedin,
                telegram,
                passwordHash,
                role: 'MEMBER',
            },
        });
        res.status(201).json({ success: true, message: 'Member registered successfully' });
    }
    catch (error) {
        console.error('Register member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerMember = registerMember;
// Get Members (Public)
const getMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield db_1.prisma.user.findMany({
            where: { role: 'MEMBER' },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json(members);
    }
    catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});
exports.getMembers = getMembers;
// Get Students (Public)
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield db_1.prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json(students);
    }
    catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});
exports.getStudents = getStudents;
// Update Profile (Protected)
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { name, phone, email, github, linkedin, telegram, department, batch, currentPassword, newPassword } = req.body;
        let profileImage = req.body.profileImage;
        // If email is being changed, check for uniqueness
        if (email && email !== user.email) {
            const existingUser = yield db_1.prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }
        if (req.file) {
            const uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path, { folder: "kts_profiles" });
            profileImage = uploadResult.secure_url;
        }
        let passwordHash = undefined;
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }
            const dbUser = yield db_1.prisma.user.findUnique({ where: { id: user.userId } });
            if (!dbUser || !dbUser.passwordHash) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, dbUser.passwordHash);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Incorrect current password' });
            }
            passwordHash = yield bcryptjs_1.default.hash(newPassword, 10);
        }
        const updateData = {
            name,
            phone,
            email,
            profileImage,
            github,
            linkedin,
            telegram,
            department,
            batch
        };
        if (passwordHash) {
            updateData.passwordHash = passwordHash;
        }
        const updatedUser = yield db_1.prisma.user.update({
            where: { id: user.userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileImage: true,
                phone: true,
                department: true,
                batch: true,
                github: true,
                linkedin: true,
                telegram: true
            }
        });
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.updateProfile = updateProfile;
const searchStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query.q;
    const field = req.query.field;
    if (!q || q.length < 2) {
        return res.json([]);
    }
    // Validate field
    const searchField = ["name", "department", "batch"].includes(field) ? field : "name";
    // Build dynamic where clause
    const whereClause = {
        role: "STUDENT",
        [searchField]: { contains: q, mode: "insensitive" },
    };
    const students = yield db_1.prisma.user.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            department: true,
            email: true,
            phone: true,
            batch: true,
            profileImage: true,
        },
    });
    res.json(students);
});
exports.searchStudents = searchStudents;
const deleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const member = yield db_1.prisma.user.findUnique({
            where: { id },
        });
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }
        yield db_1.prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Delete member error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteMember = deleteMember;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.prisma.user.findMany({
            where: {
                role: {
                    in: ["MEMBER", "ADMIN"],
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                batch: true,
                profileImage: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
