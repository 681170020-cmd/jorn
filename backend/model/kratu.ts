import mongoose from "mongoose";

const kratuSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        KratuTopic: {
            type: String,
            enum: ["General", "Knowledge"],
            required: true,
        },

        KratuImgs: { type: String, required: true }, // รูปภาพ
        KratuDetails: { type: String, required: true }, //รายละเอียดกระทู้
        like: { type: String, default: 0 }, // จำนวนไลก์
        replylog: { type: String, required: true }, //คอมเมนต์
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("kratu", kratuSchema);