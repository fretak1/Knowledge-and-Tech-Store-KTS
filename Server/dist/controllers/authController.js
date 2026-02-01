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
exports.resetPassword = exports.verifyResetCode = exports.forgotPassword = exports.getMember = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const sendEmail_1 = require("../lib/sendEmail");
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role = 'STUDENT' } = req.body;
        // Manual Validation
        const errors = {};
        if (!name || name.trim().length === 0)
            errors.name = { _errors: ["Name is required"] };
        if (!email || !/^\S+@\S+\.\S+$/.test(email))
            errors.email = { _errors: ["Invalid email"] };
        if (!password || password.length < 6)
            errors.password = { _errors: ["Password must be at least 6 characters"] };
        const validRoles = ['ADMIN', 'TECHNICIAN', 'STUDENT', 'MEMBER'];
        if (role && !validRoles.includes(role))
            errors.role = { _errors: ["Invalid role"] };
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: { fieldErrors: errors } });
        }
        // Check existing user
        const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        // Hash password
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = yield db_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id, });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordsMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        }, process.env.JWT_SECRET, { expiresIn: '60m' });
        // Set Cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 60 minitus
        });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department,
                batch: user.batch,
                github: user.github,
                linkedin: user.linkedin,
                telegram: user.telegram,
                profileImage: user.profileImage,
            },
            accessToken
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
// Logout
const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// Get Current User (Me)
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                department: true,
                batch: true,
                github: true,
                linkedin: true,
                telegram: true,
                profileImage: true,
                createdAt: true,
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.getMe = getMe;
const getMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield db_1.prisma.user.findMany({
            where: { role: 'MEMBER' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                batch: true,
                phone: true,
                github: true,
                linkedin: true,
                telegram: true,
                profileImage: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json({ user: members });
    }
    catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});
exports.getMember = getMember;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        yield db_1.prisma.user.update({
            where: { id: user.id },
            data: { resetCode, resetCodeExpires }
        });
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Password Reset Code</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Use the following 6-digit code to proceed:</p>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
                    ${resetCode}
                </div>
                <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="text-align: center; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} KTS. All rights reserved.</p>
            </div>
        `;
        yield (0, sendEmail_1.sendEmail)(user.email, 'Your Password Reset Code', message);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.forgotPassword = forgotPassword;
const verifyResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpires: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Verify code error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.verifyResetCode = verifyResetCode;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, password } = req.body;
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpires: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired code session' });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetCode: null,
                resetCodeExpires: null
            }
        });
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;
