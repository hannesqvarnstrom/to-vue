"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __importDefault(require("../models"));
var User = models_1.default.User;
var checkDuplicateUsernameOrEmail = function (req, res, next) {
    if (!req.body || !req.body.username || !req.body.email)
        return res.status(400).send({ message: 'Bad request' });
    User.findOne({ username: req.body.username })
        .exec(function (err, user) {
        if (err)
            return res.status(500).send({ message: err });
        if (user)
            return res.status(400).send({ message: 'Username already in use.' });
        User.findOne({ email: req.body.email })
            .exec(function (err, user) {
            if (err)
                return res.status(500).send({ message: err });
            if (user)
                return res.status(400).send({ message: 'Email already in use.' });
            return next();
        });
    });
};
var verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};
exports.default = verifySignUp;
