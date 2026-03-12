import { successRes, errRes } from "../../main";
import Post from "../../../model/post";
import { IPet } from "../../../types/pet";

export default async function createPet(data: IPet) {
    try {
        const newPost = await Post.create(data);

        return successRes({
            message: "สร้างโพสต์สัตว์เลี้ยงสำเร็จ",
            pet: newPost,
        });
    } catch (error: any) {
        console.error("Error creating pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
