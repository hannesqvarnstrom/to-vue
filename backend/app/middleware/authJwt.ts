import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { CallbackError } from "mongoose";
import authConfig from '../config/auth.config'
import { RoleDocument, UserDocument } from "../interfaces";
import db from '../models'
import { findToken } from "../helpers";

const { User, Role } = db;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = findToken(req);
    jwt.verify(token, authConfig.secret,
        (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
            if (err)
                return res.status(401).send({ message: 'Unauthorized.', err, token })

            if (decoded === undefined) return res.status(500).send({ message: 'Something went wrong in authorization.' })

            req.body.userId = decoded.user._id
            return next()
        })
}

const verifyTokenOrLetThrough = (req: Request, res: Response, next: NextFunction) => {
    const token = findToken(req);
    jwt.verify(token, authConfig.secret,
        (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
            if (err)
                return next()

            if (decoded === undefined){
                return next()
            } 

            req.body.userId = decoded.user._id
            return next()
        })
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => checkPermission(req, res, next, 'admin')


const isModerator = (req: Request, res: Response, next: NextFunction) => checkPermission(req, res, next, 'moderator')


export const checkPermission = (req: Request, res: Response, next: NextFunction, level: string) => {
    User.findById(req.body.userId).exec((err: CallbackError, user: UserDocument | null) => {
        if (err || !user)
            return res.status(500).send({ message: err })

        Role.find({
            _id: { $in: user.roles }
        },
            (err: CallbackError, roles: RoleDocument[]) => {
                if (err)
                    return res.status(500).send({ message: err })

                for (let role of roles) {
                    if (role.name === level)
                        return next()
                }

                return res.status(403).send({ message: `User does not have the permissions necessary` })
            }
        )
    })
}

const authJwt = {
    verifyToken,
    verifyTokenOrLetThrough,
    isAdmin,
    isModerator
}
export default authJwt;
