import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export const authenticateJwt = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        return res
            .status(401)
            .json({ success: false, error: "Access token is not present" });
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET as string
        ) as JwtPayload & {
            userId: string;
            email: string;
            role: string;
        };

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ success: false, error: "Invalid or expired access token" });
    }
};


export const adminOnly = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: "Access denied! Admin access required",
        });
    }
};
