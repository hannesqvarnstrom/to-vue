"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var admin_1 = __importDefault(require("./admin"));
var auth_routes_1 = __importDefault(require("./auth.routes"));
var user_routes_1 = __importDefault(require("./user.routes"));
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/admin', admin_1.default);
exports.default = router;
