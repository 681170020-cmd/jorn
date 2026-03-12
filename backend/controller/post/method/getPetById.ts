import { successRes, errRes } from "../../main";
import Pet from "../../../model/pet";

export default async function getPetById(petId: string) {
    try {
        // ดึงโพสต์ตาม ID พร้อม populate author
        const pet = await Pet.findById(petId)
            .populate("author", "username email phone location birthday");

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        return successRes({
            message: "ดึงข้อมูลโพสต์สำเร็จ",
            pet,
        });
    } catch (error: any) {
        console.error("Error fetching pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
