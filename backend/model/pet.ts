import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // ชื่อสัตว์เลี้ยง
        gender: { type: String, required: true }, // เพศ
        age: { type: String, required: true }, // อายุ
        health: { type: String, required: true }, // สุขภาพ
        address: { type: String, required: true }, // ที่อยู่
        deliveryMethod: { type: String, required: true }, // วิธีการส่งมอบ
        pickupLocation: { type: String }, // สถานที่รับ (optional)
        images: { type: [String], default: [] }, // รูปภาพหลายรูป
        additionalInfo: { type: String }, // ข้อมูลเพิ่มเติม (optional)
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }, // เชื่อมกับ User ที่โพสต์
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Pet", PetSchema);
