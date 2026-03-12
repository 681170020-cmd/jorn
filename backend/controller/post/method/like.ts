import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function like(petId: string) {
    try {
        const pet = await Post.findById(petId);

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        // เพิ่มจำนวนไลก์ (แปลงเป็นตัวเลข +1 แล้วเก็บกลับเป็น string)
        const currentLikes = parseInt(pet.like || "0", 10);
        pet.like = String(currentLikes + 1);
        await pet.save();

        return successRes({
            message: "กดไลก์สำเร็จ",
            pet,
        });
    } catch (error: any) {
        console.error("Error liking pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
