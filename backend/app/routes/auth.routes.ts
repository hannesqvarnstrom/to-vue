import { verifySignUp, authJwt } from '../middleware'
import { signup, signin, refreshToken } from '../controllers/auth.controller'
import express from 'express'
const router = express.Router()

router.post(
    '/signup',
    [
        verifySignUp.checkDuplicateUsernameOrEmail
    ],
    signup
)

router.post(
    '/signin',
    signin
)

router.post(
    '/refreshToken',
    refreshToken
)

export default router