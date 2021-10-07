import { Date, Document, Model, ObjectId, PaginateOptions } from "mongoose";
import User from "../models/user.model";

export interface UserDocument extends Document {
    username: string,
    email: string,
    password: string,
    roles: ObjectId[]
}

export interface RefreshTokenStatics extends Model<RefreshTokenDocument> {
    createToken(user: UserDocument): string,
    verifyExpiration(token: RefreshTokenDocument): boolean
}

export interface RoleDocument extends Document {
    name: string
}

export interface RefreshTokenDocument extends Document {
    token: string,
    user: ObjectId
    expiryDate: Date
}

export type AssetDocument = UserDocument

export type AssetDB = typeof User