import { successRes, errRes } from "../../main";
import Post from "../../../model/post";

export default async function updatePet(petId: string, updateData: any) {
    try {
        const pet = await Post.findById(petId);

        if (!pet) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        const updatedPet = await Post.findByIdAndUpdate(
            petId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("owner", "username email phone location birthday");

        return successRes({
            message: "แก้ไขโพสต์สำเร็จ",
            pet: updatedPet,
        });
    } catch (error: any) {
        console.error("Error updating pet:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
