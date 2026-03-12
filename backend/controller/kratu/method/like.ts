import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";
import kratu from "..";

export default async function like(kratuId:String) {
    try {
        const kratuu = await Kratu.findById(kratuId)
        
         if (!kratuu) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบโพสต์สัตว์เลี้ยงนี้" });
        }
        const currentLikes = parseInt(kratuu.like || "0", 10);
        kratuu.like = String(currentLikes + 1);
        await kratuu.save();

        return successRes({
            message: "กดไลก์สำเร็จ",
            kratuu,
        });

    }


    catch (error: any) {
        console.error("Error liking kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
