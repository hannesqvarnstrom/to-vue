import { CallbackError } from 'mongoose'
import { RoleDocument, UserDocument } from '../../interfaces'
import Role from '../role.model'
import User from '../user.model'

interface UserCreationCallback { (error: CallbackError, user: UserDocument | null): void }

export const createUser = async (username: string, email: string, password: string, callback: UserCreationCallback) => {
    try {
        const newUser = new User({
            username: username,
            email: email,
            password: password
        })
        await newUser.save()

        await Role.findOne({ name: 'user' }, async (err: CallbackError, doc: RoleDocument) => {
            newUser.roles.push(doc._id)

            return callback(null, newUser)
        });
    } catch (e) {
        return callback(e, null)
    }
}

export const formatUser = ({ _id, username, email, roles }: UserDocument) => ({ username, email, _id, roles })