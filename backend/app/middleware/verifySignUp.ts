
import { NextFunction, Request, Response } from 'express'
import { CallbackError } from 'mongoose'
import { UserDocument } from '../interfaces'
import db from '../models'

const { User } = db;

const checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || !req.body.username || !req.body.email)
        return res.status(400).send({ message: 'Bad request' })

    User.findOne({ username: req.body.username })
        .exec((err: CallbackError, user: UserDocument | null) => {
            if (err)
                return res.status(500).send({ message: err })

            if (user)
                return res.status(400).send({ message: 'Username already in use.' })

            User.findOne({ email: req.body.email })
                .exec((err: CallbackError, user: UserDocument | null) => {
                    if (err)
                        return res.status(500).send({ message: err })

                    if (user)
                        return res.status(400).send({ message: 'Email already in use.' })

                    return next()
                })
        })
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
}

export default verifySignUp;