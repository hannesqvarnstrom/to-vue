"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../../controllers/admin/user.controller");
var auth_controller_1 = require("../../controllers/auth.controller");
var _utilities_1 = require("../../controllers/_utilities");
var resources_1 = require("../../middleware/resources");
var user_model_1 = __importDefault(require("../../models/user.model"));
var router = express_1.default.Router();
router.get('/', [], (0, _utilities_1.searchAssets)(user_model_1.default));
router.get('/:id', [
    (0, resources_1.locateAsset)(user_model_1.default)
], _utilities_1.getAsset);
router.put('/:id', [
    (0, resources_1.locateAsset)(user_model_1.default)
], user_controller_1.updateUser);
router.delete('/:id', [
    (0, resources_1.locateAsset)(user_model_1.default)
], _utilities_1.deleteAsset);
router.post('/', [], auth_controller_1.signup);
exports.default = router;
