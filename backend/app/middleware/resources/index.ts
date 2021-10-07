import { NextFunction, Request, Response } from "express";
import { AssetDB, AssetDocument } from "../../interfaces";
import db from "../../models";
import { authUserIsOwner } from "../_utilities";

const ensureIsOwner = async (req: Request, res: Response, next: NextFunction) => {
    const status = await authUserIsOwner(req, req.body.asset as AssetDocument);

    if (!status) {
        return res.status(401).send({ message: 'Unauthorized' })
    }
    return next()
}

const locateAsset = (collection: AssetDB) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const asset = await _getAssetInstance(req, res, next, collection, async (error, asset) => {
            if (error) {
                console.log(error)
                return null
            }
            return asset
        });

        if (asset) {
            req.body.asset = asset;
            return next();
        } else {
            return res.status(400).send({ message: 'Bad request' })
        }
    }
}

const _getAssetInstance = (req: Request, res: Response, next: NextFunction, type: AssetDB, callback: any) => {
    const id = req.params.id;

    if (!db.mongoose.Types.ObjectId.isValid(id))
        return callback('Bad request', null)

    return callback(null, type.findById({ _id: id }));
}

export {
    ensureIsOwner,
    locateAsset
}