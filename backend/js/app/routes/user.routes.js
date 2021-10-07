"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var _utilities_1 = require("../controllers/_utilities");
var resources_1 = require("../middleware/resources");
var profile_controller_1 = require("../controllers/profile.controller");
var user_model_1 = __importDefault(require("../models/user.model"));
var router = express_1.default.Router();
router.use('/:id', [
    (0, resources_1.locateAsset)(user_model_1.default),
    resources_1.ensureIsOwner
]);
router.get('/:id', function (req, res, next) {
    return res.status(200).send({ asset: req.body.asset });
});
router.delete('/:id', _utilities_1.deleteAsset);
router.put('/:id', profile_controller_1.updateProfile);
exports.default = router;
