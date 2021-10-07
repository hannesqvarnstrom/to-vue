import mongoose from 'mongoose'
import User from './user.model'
import Role from './role.model'
import RefreshToken from './refresh-token.model'
// your models here
//
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.Promise = global.Promise;

const db = {
    mongoose,
    User,
    Role,
    RefreshToken,
    // your dbs here
    //
    ROLES: [
        'user',
        'admin',
        'moderator'
    ],

};


export default db;
