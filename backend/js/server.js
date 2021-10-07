"use strict";
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
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = __importDefault(require("./app/routes"));
var models_1 = __importDefault(require("./app/models"));
var db_config_1 = __importDefault(require("./app/config/db.config"));
var user_1 = require("./app/models/user");
var User = models_1.default.User, Role = models_1.default.Role;
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: "PUT,POST,GET,DELETE,PATCH,OPTIONS",
    allowedHeaders: 'x-access-token, Content-Type',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
models_1.default.mongoose
    .connect("mongodb+srv://" + db_config_1.default.USER + ":" + db_config_1.default.PW + "@" + db_config_1.default.HOST + "/" + db_config_1.default.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
    console.log('Successfully connected to MongoDB');
})
    .catch(function (err) {
    console.error("Connection error for uri: mongodb+srv://" + db_config_1.default.USER + ":" + db_config_1.default.PW + "@" + db_config_1.default.HOST + "/" + db_config_1.default.DB, err);
});
var initial = function () {
    // role setup
    Role.estimatedDocumentCount(undefined, function (err, count) {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save(function (err) {
                if (err)
                    console.error('error', err);
                console.log('added "user" to roles collection');
                new Role({
                    name: 'moderator'
                }).save(function (err) {
                    if (err)
                        console.error('error', err);
                    console.log('added "moderator" to roles collection');
                    new Role({
                        name: 'admin'
                    }).save(function (err) {
                        if (err)
                            console.error('error', err);
                        console.log('added "admin" to roles collection');
                    });
                });
            });
        }
        else {
        }
    }).then(function (something) {
        // creating an admin user
        User.findOne({ email: process.env.ADMIN_EMAIL })
            .exec()
            .then(function (user) {
            if (!user) {
                (0, user_1.createUser)('admin', process.env.ADMIN_EMAIL || '', process.env.ADMIN_PASSWORD, function (err, user) {
                    return __awaiter(this, void 0, void 0, function () {
                        var role;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err || !user)
                                        return [2 /*return*/, console.log('something went wrong while creating admin account')];
                                    return [4 /*yield*/, Role.findOne({ name: 'admin' })];
                                case 1:
                                    role = _a.sent();
                                    if (!role)
                                        return [2 /*return*/, console.log('something went wrong while creating admin account')];
                                    user.roles.push(role._id);
                                    console.log('admin account created');
                                    return [4 /*yield*/, user.save()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }
        });
    });
};
initial();
app.use('/api', routes_1.default);
app.get('/', function (req, res) {
    res.send({ message: 'Hëllö wörld!' });
});
// -------------------------------------
app.listen(process.env.PORT, function () {
    console.log("Server is listening on port " + process.env.PORT);
});
