import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { findToken } from "../helpers";
import authConfig from "../config/auth.config";
import { ObjectId } from "mongoose";
import User from "../models/user.model";
import Role from "../models/role.model";
import { AssetDocument } from "../interfaces";

export const isAdmin = async (id: ObjectId): Promise<boolean> => {
    let status = false
    try {
        const user = await User.findById(id).populate('roles', 'name');
        const roles = await Role.find({ _id: { $in: user.roles } });

        for (let role of roles) {
            if (role.name === 'admin')
                status = true;
        }

        return status
    } catch (e) {
        console.log(e);
        return status;
    }
}

export const authUserIsOwner = async (req: Request, asset: AssetDocument): Promise<boolean> => {
    try {
        const decoded = jwt.verify(findToken(req), authConfig.secret) as jwt.JwtPayload;

        const adminStatus = await isAdmin(decoded.user._id);

        if (adminStatus) return true
        
        return asset._id.toString() === decoded.user._id || asset._id === null;
    } catch (e) {
        console.log(e);
        return false;
    }
}