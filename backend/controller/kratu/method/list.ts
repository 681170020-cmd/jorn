import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";

export default async function list() {
    try {
        const kratuu = await Kratu.find()
            .populate("owner", "username email phone location birthday")
            .sort({ createdAt: -1 });

            return successRes({
            message: "ดึงข้อมูลโพสต์ทั้งหมดสำเร็จ",
            kratuu,
            count: kratuu.length,
        });
        }



    catch (error: any) {
        console.error("Error fetching kratu", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}