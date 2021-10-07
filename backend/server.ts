import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import router from './app/routes'
import { CallbackError } from 'mongoose'
import { RoleDocument, UserDocument } from './app/interfaces'
import db from './app/models'
import dbConfig from './app/config/db.config'
import { createUser } from './app/models/user'

const { User, Role } = db;
const app = express()

app.use(cors({
    origin: '*',
    methods: "PUT,POST,GET,DELETE,PATCH,OPTIONS",
    allowedHeaders: 'x-access-token, Content-Type',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.mongoose
    .connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PW}@${dbConfig.HOST}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to MongoDB')
    })
    .catch((err: any) => {
        console.error(`Connection error for uri: mongodb+srv://${dbConfig.USER}:${dbConfig.PW}@${dbConfig.HOST}/${dbConfig.DB}`, err)
    })

const initial = () => {
    // role setup
    Role.estimatedDocumentCount(undefined, (err: any, count: number) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save((err: CallbackError) => {
                if (err) console.error('error', err)
                console.log('added "user" to roles collection')

                new Role({
                    name: 'moderator'
                }).save((err: CallbackError) => {
                    if (err) console.error('error', err)
                    console.log('added "moderator" to roles collection')

                    new Role({
                        name: 'admin'
                    }).save((err: CallbackError) => {
                        if (err) console.error('error', err)
                        console.log('added "admin" to roles collection')
                    })
                })
            })
        } else {

        }
    }).then(something => {
        // creating an admin user
        User.findOne({ email: process.env.ADMIN_EMAIL })
            .exec()
            .then((user: UserDocument | null) => {
                if (!user) {
                    createUser('admin', process.env.ADMIN_EMAIL || '', process.env.ADMIN_PASSWORD, async function (err: CallbackError, user: UserDocument | null) {
                        if (err || !user)
                            return console.log('something went wrong while creating admin account');
                        const role = await Role.findOne({ name: 'admin' });
                        if (!role)
                            return console.log('something went wrong while creating admin account');

                        user.roles.push(role._id);
                        console.log('admin account created');
                        await user.save()
                    })
                }
            })
    })


}

initial()


app.use('/api', router);

app.get('/', (req, res) => {
    res.send({ message: 'Hëllö wörld!' })
})


// -------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})