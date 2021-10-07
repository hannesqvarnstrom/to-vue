import mongoose from 'mongoose'
import { RoleDocument } from '../interfaces'

const Role = mongoose.model<RoleDocument>(
    'Role',
    new mongoose.Schema({
        name: String
    })
)

export default Role