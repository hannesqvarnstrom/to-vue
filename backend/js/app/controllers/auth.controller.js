"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.signin = exports.signup = void 0;
var auth_config_1 = __importDefault(require("../config/auth.config"));
var models_1 = __importDefault(require("../models"));
var user_1 = require("../models/user");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var User = models_1.default.User, RefreshToken = models_1.default.RefreshToken;
var jwtSign = function (user) { return jsonwebtoken_1.default.sign({ user: user }, auth_config_1.default.secret, { expiresIn: auth_config_1.default.jwtExperiation }); };
var signup = function (req, res) {
    var _a = req.body, username = _a.username, email = _a.email, password = _a.password;
    (0, user_1.createUser)(username, email.toLowerCase(), password, function (err, user) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err || !user)
                        return [2 /*return*/, res.status(500).send({ message: 'Something went wrong when saving...', err: err })];
                    return [4 /*yield*/, user.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(201).send({ message: 'Success!', user: (0, user_1.formatUser)(user) })];
            }
        });
    }); });
};
exports.signup = signup;
var signin = function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    User.findOne({ email: email.toLowerCase() })
        .populate('roles')
        .exec(function (err, user) {
        if (err || !user)
            return res.status(403).send({ message: 'Error! Wrong password or email' });
        bcryptjs_1.default.compare(password, user.password, function (err, succ) { return __awaiter(void 0, void 0, void 0, function () {
            var accessToken, refreshToken, exp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err || !succ)
                            return [2 /*return*/, res.status(403).send({ message: 'Error! Wrong password or email', err: err, email: email, password: password, user: user })];
                        accessToken = jwtSign(user);
                        return [4 /*yield*/, RefreshToken.createToken(user)];
                    case 1:
                        refreshToken = _a.sent(), exp = jsonwebtoken_1.default.decode(accessToken).exp;
                        return [2 /*return*/, res.status(200).send(__assign(__assign({}, (0, user_1.formatUser)(user)), { accessToken: accessToken, refreshToken: refreshToken, exp: exp }))];
                }
            });
        }); });
    });
};
exports.signin = signin;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requestToken, refreshToken_1, user, newAccessToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestToken = req.body.refreshToken;
                if (!requestToken)
                    return [2 /*return*/, res.status(403).send({ message: 'Refresh token is required!' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, RefreshToken.findOne({ token: requestToken })];
            case 2:
                refreshToken_1 = _a.sent();
                if (!refreshToken_1)
                    return [2 /*return*/, res.status(403).send({ message: 'Refresh token is not valid' })];
                if (RefreshToken.verifyExpiration(refreshToken_1)) {
                    RefreshToken.findByIdAndRemove(refreshToken_1._id, { useFindAndModify: false });
                    return [2 /*return*/, res.status(403).send({ message: 'Refresh token expired. Please login again.' })];
                }
                return [4 /*yield*/, User.findById(refreshToken_1.user)];
            case 3:
                user = _a.sent();
                if (user) {
                    newAccessToken = jwtSign(user);
                    return [2 /*return*/, res.status(200).send({ accessToken: newAccessToken, refreshToken: refreshToken_1 })];
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).send({ message: err_1 })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
