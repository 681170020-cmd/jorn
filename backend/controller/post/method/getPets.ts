import { successRes, errRes } from "../../main";
import Pet from "../../../model/pet";

export default async function getPets() {
    try {
        // ดึงรายการโพสต์ทั้งหมดพร้อม populate author
        const pets = await Pet.find()
            .populate("author", "username email phone location birthday")
            .sort({ createdAt: -1 }); // เรียงจากใหม่ไปเก่า

        return successRes({
            message: "ดึงข้อมูลโพสต์สำเร็จ",
            pets,
            count: pets.length,
        });
    } catch (error: any) {
        console.error("Error fetching pets:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
