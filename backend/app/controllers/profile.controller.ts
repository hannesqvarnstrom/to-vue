import { Request, Response } from "express";
import {UserDocument} from '../interfaces'
import User from "../models/user.model";

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = req.body.asset as UserDocument;
        const others = await User.find({ username: req.body.username });

        if (others.length) return res.status(400).send({ message: 'Username already taken' })
        
        user.username = req.body.username;
        const updatedUser = await user.save();
        
        return res.status(203).send({ message: 'Updated successfully!', asset: updatedUser })
    } catch (e) {
        return res.status(500).send(e)
    }
}