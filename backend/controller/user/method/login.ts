import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../model/user";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. ตรวจสอบว่ามี User อีเมลนี้อยู่ในระบบไหม
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        // 2. ตรวจสอบรหัสผ่าน (เทียบ password ที่ส่งมา กับ hash ใน DB)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        // 3. สร้าง JWT Token
        const secret = process.env.JWT_SECRET || "your_fallback_secret";
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: "1d" } // Token หมดอายุใน 1 วัน
        );

        // 4. ส่ง Token และข้อมูลเบื้องต้นกลับไปให้ Client
        return res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
};
