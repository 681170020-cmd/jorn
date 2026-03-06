import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";

export default async function get(kratuId:String) {
    try {
        const kratuu = await Kratu.findById(kratuId).populate("owner", "username email phone location birthday");

        
        
         if (!kratuu) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบกระทู้นี้" });
        }

        return successRes({
            message: "ดึงข้อมูลโพสต์สำเร็จ",
            kratuu,
        });
    }


    catch (error: any) {
        console.error("Error fetching kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
