import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errRes } from "../controller/main";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
            };
        }
    }
}

export default function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // ดึง token จาก Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(
                errRes.BAD_REQUEST({
                    message: "ไม่พบ token กรุณา login ก่อน"
                })
            );
        }

        // แยก token จาก "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // Verify token
        const jwtSecret = process.env.JWT_SECRET || "your_super_secret_key_change_this_in_production";
        const decoded = jwt.verify(token, jwtSecret) as {
            userId: string;
            username: string;
        };

        // เพิ่ม user info ใน request
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
        };

        next();
    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json(
                errRes.BAD_REQUEST({
                    message: "Token ไม่ถูกต้อง"
                })
            );
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(
                errRes.BAD_REQUEST({
                    message: "Token หมดอายุแล้ว กรุณา login ใหม่"
                })
            );
        }
        return res.status(500).json(
            errRes.INTERNAL_SERVER_ERROR({
                message: "เกิดข้อผิดพลาดในการตรวจสอบ token"
            })
        );
    }
}
