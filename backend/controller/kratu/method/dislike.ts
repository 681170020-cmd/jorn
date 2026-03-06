import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";

export default async function dislike(kratuId:String) {
    try {
        const kratuu = await Kratu.findById(kratuId)
        return successRes({
            message: "ยกเลิกไลก์สำเร็จ",
            kratuu,
        });
    }


    catch (error: any) {
        console.error("Error disliking kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
