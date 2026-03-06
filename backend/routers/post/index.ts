import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

// GET /api/ → ดึงโพสต์ทั้งหมด (ต้องอยู่ก่อน /:id)
routers.get("/", resFunc.list);

// GET /api/:id → ดึงโพสต์ตาม ID
routers.get("/:id", resFunc.get);

// POST /api/ → สร้างโพสต์ใหม่
routers.post("/", resFunc.create);

// PUT /api/:id → อัปเดตโพสต์
routers.put("/:id", resFunc.update);

// DELETE /api/:id → ลบโพสต์
routers.delete("/:id", resFunc.remove);

// PATCH /api/:id/like → กดไลก์
routers.patch("/:id/like", resFunc.like);

// PATCH /api/:id/dislike → ยกเลิกไลก์
routers.patch("/:id/dislike", resFunc.dislike);

export default routers;
