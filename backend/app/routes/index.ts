import express from 'express'
import cors from 'cors'
const router = express.Router()
import adminRouter from './admin'
import authRouter from './auth.routes'

import userRouter from './user.routes'

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/admin', adminRouter);

export default router