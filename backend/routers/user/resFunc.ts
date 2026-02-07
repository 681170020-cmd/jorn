import registerController from "@/controller/user/method/register"; // import function โดยตรง
import loginController from "@/controller/user/method/login";
import { Request, Response } from "express";

// ฟังก์ชันสำหรับสมัครสมาชิก
async function register(req: Request, res: Response) {
  const data = await registerController(req.body);
  return res.status(data.code).json(data);
}

async function login(req: Request, res: Response) {
  const data = await loginController(req.body);
  return res.status(data.code).json(data);
}

export default {
  register,
  login,
};