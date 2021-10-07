import config from '../config/auth.config'
import db from '../models'
import { createUser, formatUser } from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { CallbackError } from 'mongoose'
import { UserDocument } from '../interfaces'

const { User, RefreshToken } = db;

const jwtSign = (user: UserDocument) => jwt.sign({ user }, config.secret, { expiresIn: config.jwtExperiation })

const signup = (req: Request, res: Response) => {
    const { username, email, password } = req.body

    createUser(
        username,
        (email as string).toLowerCase(),
        password,
        async (err: CallbackError, user: UserDocument | null) => {
            if (err || !user)
                return res.status(500).send({ message: 'Something went wrong when saving...', err })
            await user.save()
            return res.status(201).send({ message: 'Success!', user: formatUser(user) })
        })
}

const signin = (req: Request, res: Response) => {
    const { email, password } = req.body

    User.findOne({ email: (email as string).toLowerCase() })
        .populate('roles')
        .exec((err: CallbackError, user: UserDocument | null) => {
            if (err || !user)
                return res.status(403).send({ message: 'Error! Wrong password or email' })

            bcrypt.compare(password, user.password, async (err, succ) => {
                if (err || !succ) return res.status(403).send({ message: 'Error! Wrong password or email', err, email, password, user })

                const
                    accessToken = jwtSign(user),
                    refreshToken = await RefreshToken.createToken(user),
                    exp = (jwt.decode(accessToken) as jwt.JwtPayload).exp;

                return res.status(200).send({ ...formatUser(user), accessToken, refreshToken, exp })
            })
        })
}

const refreshToken = async (req: Request, res: Response) => {
    const requestToken = req.body.refreshToken

    if (!requestToken)
        return res.status(403).send({ message: 'Refresh token is required!' })

    try {
        const refreshToken = await RefreshToken.findOne({ token: requestToken })

        if (!refreshToken)
            return res.status(403).send({ message: 'Refresh token is not valid' })

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false })

            return res.status(403).send({ message: 'Refresh token expired. Please login again.' })
        }

        const user = await User.findById(refreshToken.user)

        if (user) {
            const newAccessToken = jwtSign(user)

            return res.status(200).send({ accessToken: newAccessToken, refreshToken })
        }
    } catch (err) {
        return res.status(500).send({ message: err })
    }
}

export {
    signup,
    signin,
    refreshToken
}
