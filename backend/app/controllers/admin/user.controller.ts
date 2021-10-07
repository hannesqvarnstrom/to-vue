import { Request, Response } from 'express'
import { ObjectId } from 'mongoose';
import { UserDocument } from '../../interfaces';

import Role from '../../models/role.model'
import User from '../../models/user.model'

export const updateUser = async (req: Request, res: Response) => {
    try {
        const {
            username,
            email,
            roles
        } = req.body;

        const user = req.body.asset as UserDocument;

        let newRoles = await Role.find({ name: { $in: roles } });

        user.username = username;
        user.email = email;

        user.roles = newRoles.map(role => role._id);

        const result = await user.save();

        return res.status(200).send({ asset: result })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error })
    }
}


