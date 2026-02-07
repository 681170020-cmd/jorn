import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../model/user';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. หา User จากฐานข้อมูล
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid Username or Password" });

        // 2. เช็ครหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Username or Password" });

        // 3. สร้าง JWT Token (นำไปใช้ใน Middleware auth.ts ที่คุณสร้างไว้)
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};