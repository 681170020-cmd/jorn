import { successRes, errRes } from "../../main";
import Kratu from "../../../model/kratu";
import { Ikratu } from "../../../types/kratu";

export default async function createkratu(data: Ikratu) {
    try {
        const newPost = await Kratu.create(data);

        return successRes({
            message: "สร้างโพสต์สัตว์เลี้ยงสำเร็จ",
            kratu: newPost,
        });
    } catch (error: any) {
        console.error("Error creating kratu:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
