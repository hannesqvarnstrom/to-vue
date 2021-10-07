import { Request, Response } from "express";
import Role from "../../models/role.model";

export const getRoles = async (req: Request, res: Response) => {
    const roles = await Role.find();
    return res.status(200).send({ roles })
}