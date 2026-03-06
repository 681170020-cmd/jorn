import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function dislike(petId: string) {
    try {
        const pet = await Post.findById(petId);

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        // ลดจำนวนไลก์ (ไม่ให้ต่ำกว่า 0)
        const currentLikes = parseInt(pet.like || "0", 10);
        pet.like = String(Math.max(0, currentLikes - 1));
        await pet.save();

        return successRes({
            message: "ยกเลิกไลก์สำเร็จ",
            pet,
        });
    } catch (error: any) {
        console.error("Error disliking pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
