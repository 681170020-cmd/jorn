import controllers from "../../controller/kratu";
import { Request, Response } from "express";


async function create(req: Request, res: Response) {
    const data = await controllers.createkratu(req.body);
    return res.status(data.code).json(data);
}


async function get(req: Request, res: Response) {
    const data = await controllers.get(req.params.id as string);
    return res.status(data.code).json(data);
}


async function list(req: Request, res: Response) {
    const data = await controllers.list();
    return res.status(data.code).json(data);
}


async function update(req: Request, res: Response) {
    const data = await controllers.update(req.params.id as string, req.body);
    return res.status(data.code).json(data);
}


async function remove(req: Request, res: Response) {
    const data = await controllers.remove(req.params.id as string);
    return res.status(data.code).json(data);
}


async function like(req: Request, res: Response) {
    const data = await controllers.like(req.params.id as string);
    return res.status(data.code).json(data);
}


async function dislike(req: Request, res: Response) {
    const data = await controllers.dislike(req.params.id as string);
    return res.status(data.code).json(data);
}


export default {
    create,
    get,
    list,
    update,
    remove,
    like,
    dislike,
};
