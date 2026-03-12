import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";

export default async function remove(kratuId: String) {
    try {
        const kratuu = await Kratu.findById(kratuId)

        if (!kratuu) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }

        await Kratu.findByIdAndDelete(kratuId);

        return successRes({
            message: "ลบโพสต์สำเร็จ",
            kratuId,
        });
    }


    catch (error: any) {
        console.error("Error deleting kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}