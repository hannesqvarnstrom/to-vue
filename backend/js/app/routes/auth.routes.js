"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("../middleware");
var auth_controller_1 = require("../controllers/auth.controller");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.post('/signup', [
    middleware_1.verifySignUp.checkDuplicateUsernameOrEmail
], auth_controller_1.signup);
router.post('/signin', auth_controller_1.signin);
router.post('/refreshToken', auth_controller_1.refreshToken);
exports.default = router;
