"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.findToken = void 0;
var findToken = function (req) {
    var token = req.headers['x-access-token'] || req.headers['authorization'] || req.body.token;
    if (!token)
        return '';
    if (token.indexOf('Bearer') !== -1)
        token = token.substr(7, token.length);
    return token;
};
exports.findToken = findToken;
var capitalize = function (str) { return str[0].toUpperCase() + str.substring(1); };
exports.capitalize = capitalize;
