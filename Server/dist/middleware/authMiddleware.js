"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJwt = (req, res, next) => {
    var _a;
    const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!accessToken) {
        return res
            .status(401)
            .json({ success: false, error: "Access token is not present" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ success: false, error: "Invalid or expired access token" });
    }
};
exports.authenticateJwt = authenticateJwt;
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            error: "Access denied! Admin access required",
        });
    }
};
exports.adminOnly = adminOnly;
