"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var middleware_1 = require("../../middleware");
var _utilities_1 = require("../../middleware/_utilities");
var user_routes_1 = __importDefault(require("./user.routes"));
var role_routes_1 = __importDefault(require("./role.routes"));
var router = express_1.default.Router();
router.use([
    middleware_1.authJwt.verifyToken,
    _utilities_1.isAdmin
]);
router.use('/users', user_routes_1.default);
router.use('/roles', role_routes_1.default);
exports.default = router;
