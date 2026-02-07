import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // ชื่อ
    password: { type: String, required: true }, // รหัส
    location: { type: String, required: true }, // ที่อยู่
    birthday: { type: String, required: true }, // วันเกิด
    email: { type: String, required: true, unique: true }, // อีเมล
    phone: { type: String, required: true }, // เบอร์
  },
  { timestamps: true, versionKey: false }
);

// ไม่ hash password (ตามที่ผู้ใช้ต้องการ)

export default mongoose.model("User", UserSchema);