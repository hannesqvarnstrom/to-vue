import express from 'express'
import { authJwt } from '../../middleware';
import { isAdmin } from '../../middleware/_utilities';
import userRouter from './user.routes'
import roleRouter from './role.routes'

const router = express.Router();

router.use(
    [
        authJwt.verifyToken,
        isAdmin
    ]);

router.use('/users', userRouter);
router.use('/roles', roleRouter)

export default router;