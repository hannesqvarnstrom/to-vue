"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var role_controller_1 = require("../../controllers/admin/role.controller");
var router = express_1.default.Router();
router.get('/', role_controller_1.getRoles);
exports.default = router;
