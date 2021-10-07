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
exports.paginate = exports.searchAssets = exports.getPagination = exports.deleteAsset = exports.getAsset = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var getAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, res.status(200).send({ asset: req.body.asset })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).send({ error: error })];
        }
        return [2 /*return*/];
    });
}); };
exports.getAsset = getAsset;
var deleteAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var asset, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                asset = req.body.asset;
                return [4 /*yield*/, asset.remove()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).send({ message: 'Asset deleted' })];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).send({ error: error_1 })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteAsset = deleteAsset;
var getPagination = function (page, size) {
    var limit = size || 3;
    var offset = page * limit || 0;
    return { limit: limit, offset: offset };
};
exports.getPagination = getPagination;
var searchAssets = function (db) { return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, q, page, size, owned, nameObject, query, _b, limit, offset, results;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, q = _a.q, page = _a.page, size = _a.size, owned = _a.owned;
                nameObject = { name: { $regex: q, $options: 'i' } };
                // if there is a query string, create a basic regexp (above). if nothing else below triggers, this will be the basic query
                if (q) {
                    query = __assign(__assign({}, nameObject), { publicStatus: true });
                }
                _b = (0, exports.getPagination)(page, size), limit = _b.limit, offset = _b.offset;
                return [4 /*yield*/, user_model_1.default.find(query).populate('roles', 'name')];
            case 1:
                results = _c.sent();
                return [2 /*return*/, res.status(200).send((0, exports.paginate)(results, limit, offset))];
        }
    });
}); }; };
exports.searchAssets = searchAssets;
var paginate = function (payload, limit, offset) {
    var results = payload;
    var totalResults = results.length;
    var totalPages = Math.ceil(totalResults / limit);
    if (totalResults > limit) {
        results = results.slice(offset, offset + limit);
    }
    var currentPage = Math.ceil(offset / limit);
    var currentRange = offset + 1 + " - " + ((offset + limit) < totalResults ? (offset + limit) : totalResults);
    return {
        results: results,
        currentRange: currentRange,
        totalResults: totalResults,
        totalPages: totalPages,
        limit: limit,
        currentPage: currentPage
    };
};
exports.paginate = paginate;
