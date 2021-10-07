import express from 'express'
import { updateUser } from '../../controllers/admin/user.controller';
import { signup } from '../../controllers/auth.controller';
import { deleteAsset, getAsset, searchAssets } from '../../controllers/_utilities';
import { locateAsset } from '../../middleware/resources';
import User from '../../models/user.model';

const router = express.Router();

router.get(
    '/',
    [

    ],
    searchAssets(User)
)

router.get(
    '/:id',
    [
        locateAsset(User)
    ],
    getAsset
);

router.put(
    '/:id',
    [
        locateAsset(User)
    ],
    updateUser
);

router.delete(
    '/:id',
    [
        locateAsset(User)
    ],
    deleteAsset
);

router.post(
    '/',
    [

    ],
    signup
)
export default router;