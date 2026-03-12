import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";

export default async function update(kratuId: String, updateData: any) {
    try {
        const kratuu = await Kratu.findById(kratuId)

        if (!kratuu) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        const updatedkratuu = await Kratu.findByIdAndUpdate(
            kratuId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("owner", "username email phone location birthday");

        return successRes({
            message: "แก้ไขโพสต์สำเร็จ",
            kratuu: updatedkratuu,
        });
    }


    catch (error: any) {
        console.error("Error updating kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}