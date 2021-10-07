import express, { NextFunction, Request, Response } from 'express'
import { deleteAsset } from '../controllers/_utilities';
import { UserDocument } from '../interfaces';
import { ensureIsOwner, locateAsset } from '../middleware/resources';
import {updateProfile} from '../controllers/profile.controller'
import User from '../models/user.model';

const router = express.Router();

router.use('/:id',
    [
        locateAsset(User),
        ensureIsOwner
    ]
)

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send({ asset: req.body.asset })
})

router.delete('/:id', deleteAsset);
router.put('/:id', updateProfile)

export default router