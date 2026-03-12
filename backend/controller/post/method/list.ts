import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function list() {
    try {
        const pets = await Post.find()
            .populate("owner", "username email phone location birthday")
            .sort({ createdAt: -1 });

        return successRes({
            message: "ดึงข้อมูลโพสต์ทั้งหมดสำเร็จ",
            pets,
            count: pets.length,
        });
    } catch (error: any) {
        console.error("Error fetching pets:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
