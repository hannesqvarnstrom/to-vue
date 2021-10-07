import { Request, Response } from "express";
import { NativeError, ObjectId, PaginateResult } from "mongoose";
import { AssetDB, AssetDocument, UserDocument } from "../interfaces";
import User from "../models/user.model";

export const getAsset = async (req: Request, res: Response) => {
    try {
        return res.status(200).send({ asset: req.body.asset })
    } catch (error) {
        return res.status(500).send({ error })
    }
}


export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const asset = req.body.asset as UserDocument
        await asset.remove()

        return res.status(200).send({ message: 'Asset deleted' })
    } catch (error) {
        return res.status(500).send({ error })
    }
}


export const getPagination = (page, size): {limit: number, offset: number} => {
    const limit = size || 3;
    const offset = page * limit || 0;

    return { limit, offset };
}



export const searchAssets = (db: AssetDB) => async (req: Request, res: Response) => {
    // page is zero indexed. currentPage is zero indexed as well
    // totalPages is NOT zero indexed.
    const { q, page, size, owned } = req.query;

    const nameObject = { name: { $regex: q as string, $options: 'i' } }


    let query;
    // if there is a query string, create a basic regexp (above). if nothing else below triggers, this will be the basic query
    if (q) {
        query = { ...nameObject, publicStatus: true }
    }

    const { limit, offset } = getPagination(page, size);

    let results = await User.find(query).populate('roles', 'name')

    return res.status(200).send(paginate(results, limit, offset))
}

export const paginate = (payload: any[], limit: number, offset: number): {
    results: any[],
    currentRange: string,
    totalResults: number,
    totalPages: number,
    limit: number,
    currentPage: number
} => {
    let results = payload;
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    
    if (totalResults > limit) {
        results = results.slice(offset, offset + limit);
    }
    const currentPage = Math.ceil(offset / limit)
    const currentRange = `${offset + 1} - ${(offset + limit) < totalResults ? (offset + limit) : totalResults}`

    return {
        results,
        currentRange,
        totalResults,
        totalPages,
        limit,
        currentPage
    }
}