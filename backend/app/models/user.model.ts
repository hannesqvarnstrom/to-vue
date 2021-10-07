import Role from './role.model'
import { RoleDocument, UserDocument } from '../interfaces'
import mongoose, { CallbackError, Document, ObjectId, PaginateModel } from 'mongoose'
import bcrypt from 'bcryptjs'
import mongoosePaginate from 'mongoose-paginate-v2'
import { NextFunction } from 'express'

const UserSchema = new mongoose.Schema<UserDocument>({
    username: String,
    email: String,
    password: String,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
})

UserSchema.pre('save', async function (next) {
    const user = this
    try {
        if (user.isModified('password') || user.isNew) {
            const salt = await bcrypt.genSalt(10);

            bcrypt.hash(user.password, salt, (hashError, hash) => {
                if (hashError)
                    return next(hashError)

                user.password = hash

                return next();
            })
        } else {
            return next()
        }
    } catch (e) {
        return next(e)
    }

})
// for cascade delete
UserSchema.pre('remove', function (next: NextFunction) {
    // Article.remove({ owner: this._id }).exec();


    return next();
});

const User = mongoose.model<UserDocument>(
    'User',
    UserSchema
)

export default User