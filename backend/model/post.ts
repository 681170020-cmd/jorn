import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        pettype: { type: String, required: true }, // ประเภทสัตว์เลี้ยง
        petname: { type: String, required: true }, // ชื่อสัตว์
        petgender: { type: String, required: true }, // เพศสัตว์
        petage: { type: String, required: true }, // อายุสัตว์
        healthstatus: { type: String, required: true }, // สถานะสุขภาพ
        currentlocation: { type: String, required: true }, // ตำแหน่งสัตว์ปัจจุบัน
        sentmethod: { type: String, required: true }, // วิธีส่ง
        recieverlocation: { type: String, required: true }, // ตำแหน่งผู้รับ
        imagepet: { type: String, required: true }, // รูปภาพสัตว์
        misc: { type: String, required: true }, // รายละเอียดอื่นๆ
        like: { type: String, default: 0 }, // จำนวนไลก์
        replylog: { type: String, required: true }, //คอมเมนต์
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Post", PostSchema);