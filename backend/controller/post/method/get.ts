import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function get(petId: string) {
    try {
        const pet = await Post.findById(petId).populate("owner", "username email phone location birthday");

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
