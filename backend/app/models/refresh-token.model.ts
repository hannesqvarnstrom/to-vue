import authConfig from '../config/auth.config'
const uuid4 = require('uuid4')
import mongoose from 'mongoose'
import { RefreshTokenDocument, RefreshTokenStatics, UserDocument } from '../interfaces';

const RefreshTokenSchema = new mongoose.Schema<RefreshTokenDocument, RefreshTokenStatics>({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expiryDate: Date
});

RefreshTokenSchema.statics.createToken = async function (user: UserDocument) {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
    );

    let token = uuid4();
    let newObject = new this({
        token: token, user: user._id, expiryDate: expiredAt
    })

    let refreshToken = await newObject.save();

    return refreshToken.token;
}

RefreshTokenSchema.statics.verifyExpiration = token => token.expiryDate.getTime() < new Date().getTime();

const RefreshToken = mongoose.model<RefreshTokenDocument, RefreshTokenStatics>("RefreshToken", RefreshTokenSchema);

export default RefreshToken
