import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function remove(petId: string) {
    try {
        const pet = await Post.findById(petId);

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        await Post.findByIdAndDelete(petId);

        return successRes({
            message: "ลบโพสต์สำเร็จ",
            petId,
        });
    } catch (error: any) {
        console.error("Error deleting pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
