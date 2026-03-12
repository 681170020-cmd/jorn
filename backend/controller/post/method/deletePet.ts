import { successRes, errRes } from "../../main";
import Pet from "../../../model/pet";

export default async function deletePet(petId: string, userId: string) {
    try {
        // หา Pet ที่ต้องการลบ
        const pet = await Pet.findById(petId);

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        // ตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
        if (pet.author.toString() !== userId) {
            return errRes.BAD_REQUEST({
                message: "คุณไม่มีสิทธิ์ลบโพสต์นี้"
            });
        }

        // ลบโพสต์
        await Pet.findByIdAndDelete(petId);

        return successRes({
            message: "ลบโพสต์สำเร็จ",
            petId,
        });
    } catch (error: any) {
        console.error("Error deleting pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
