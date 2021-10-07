"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var user_model_1 = __importDefault(require("./user.model"));
var role_model_1 = __importDefault(require("./role.model"));
var refresh_token_model_1 = __importDefault(require("./refresh-token.model"));
mongoose_1.default.Promise = global.Promise;
var db = {
    mongoose: mongoose_1.default,
    User: user_model_1.default,
    Role: role_model_1.default,
    RefreshToken: refresh_token_model_1.default,
    // your dbs here
    //
    ROLES: [
        'user',
        'admin',
        'moderator'
    ],
};
exports.default = db;
