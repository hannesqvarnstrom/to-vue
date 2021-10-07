"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_config_1 = __importDefault(require("../config/auth.config"));
var models_1 = __importDefault(require("../models"));
var helpers_1 = require("../helpers");
var User = models_1.default.User, Role = models_1.default.Role;
var verifyToken = function (req, res, next) {
    var token = (0, helpers_1.findToken)(req);
    jsonwebtoken_1.default.verify(token, auth_config_1.default.secret, function (err, decoded) {
        if (err)
            return res.status(401).send({ message: 'Unauthorized.', err: err, token: token });
        if (decoded === undefined)
            return res.status(500).send({ message: 'Something went wrong in authorization.' });
        req.body.userId = decoded.user._id;
        return next();
    });
};
var verifyTokenOrLetThrough = function (req, res, next) {
    var token = (0, helpers_1.findToken)(req);
    jsonwebtoken_1.default.verify(token, auth_config_1.default.secret, function (err, decoded) {
        if (err)
            return next();
        if (decoded === undefined) {
            return next();
        }
        req.body.userId = decoded.user._id;
        return next();
    });
};
var isAdmin = function (req, res, next) { return (0, exports.checkPermission)(req, res, next, 'admin'); };
var isModerator = function (req, res, next) { return (0, exports.checkPermission)(req, res, next, 'moderator'); };
var checkPermission = function (req, res, next, level) {
    User.findById(req.body.userId).exec(function (err, user) {
        if (err || !user)
            return res.status(500).send({ message: err });
        Role.find({
            _id: { $in: user.roles }
        }, function (err, roles) {
            if (err)
                return res.status(500).send({ message: err });
            for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
                var role = roles_1[_i];
                if (role.name === level)
                    return next();
            }
            return res.status(403).send({ message: "User does not have the permissions necessary" });
        });
    });
};
exports.checkPermission = checkPermission;
var authJwt = {
    verifyToken: verifyToken,
    verifyTokenOrLetThrough: verifyTokenOrLetThrough,
    isAdmin: isAdmin,
    isModerator: isModerator
};
exports.default = authJwt;
