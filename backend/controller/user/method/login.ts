import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import jwt from 'jsonwebtoken';

interface LoginData {
    email: string;
    password: string;
}

export default async function login(data: LoginData) {
    try {
        const { email, password } = data;

        // 1. หา User จากฐานข้อมูล
        const user = await User.findOne({ email });
        if (!user) {
            return errRes.BAD_REQUEST({ message: "Invalid Email or Password" });
        }

        // 2. เช็ครหัสผ่าน (เปรียบเทียบตรงๆ เพราะไม่ได้ hash)
        const isMatch = password === user.password;
        if (!isMatch) {
            return errRes.BAD_REQUEST({ message: "Invalid Email or Password" });
        }

        // 3. สร้าง JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        return successRes({
            message: "Login successful",
            token,
            user: { username: user.username, email: user.email }
        });

    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}