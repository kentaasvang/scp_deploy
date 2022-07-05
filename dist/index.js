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
exports.__esModule = true;
var node_scp_1 = require("node-scp");
var process_1 = require("process");
var serverClient_1 = require("./serverClient");
var core = require("@actions/core");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, client, action, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    config = Config.get();
                    client = new serverClient_1.ServerClient(config.serverConfig);
                    action = new Action(config.actionConfig, client);
                    return [4 /*yield*/, action.run()];
                case 1:
                    _a.sent();
                    (0, process_1.exit)(0);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    core.setFailed(error_1.message);
                    (0, process_1.exit)(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var Action = /** @class */ (function () {
    function Action(config, client) {
        this.config = config;
        this.client = client;
    }
    Action.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // let client: ScpClient = await this.getClient(this.config.serverConfig);
                    return [4 /*yield*/, this.client.initiate()];
                    case 1:
                        // let client: ScpClient = await this.getClient(this.config.serverConfig);
                        _a.sent();
                        return [4 /*yield*/, this.client.exists(this.config.basePath)];
                    case 2:
                        // check that base exists (Versions)
                        if (!(_a.sent())) {
                            (0, process_1.exit)(1);
                        }
                        return [4 /*yield*/, this.client.exists(this.config.basePath + "/" + this.config.buildNumber)];
                    case 3:
                        // create folder with unique value
                        if (_a.sent()) {
                            (0, process_1.exit)(1);
                        }
                        // create file
                        return [4 /*yield*/, this.client.mkdir(this.config.basePath + "/" + this.config.buildNumber)];
                    case 4:
                        // create file
                        _a.sent();
                        // push dist-folder content to build-file
                        return [4 /*yield*/, this.client.uploadDir(this.config.dirToUpload, this.config.basePath + "/" + this.config.buildNumber)];
                    case 5:
                        // push dist-folder content to build-file
                        _a.sent();
                        return [4 /*yield*/, this.client.close()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Action.prototype.getClient = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, node_scp_1.Client)({
                            host: credentials.host,
                            port: credentials.port,
                            username: credentials.username,
                            privateKey: credentials.privateKey
                        })];
                    case 1:
                        client = _a.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    return Action;
}());
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.get = function () {
        var host = core.getInput("host");
        var username = core.getInput("user");
        var basePath = core.getInput("base_path");
        var dirToUpload = core.getInput("dir_to_upload");
        var port = parseInt(core.getInput("port"));
        var privateKey = core.getInput("private_key");
        var buildNumber = core.getInput("build_number");
        return {
            actionConfig: {
                basePath: basePath,
                dirToUpload: dirToUpload,
                buildNumber: buildNumber
            },
            serverConfig: {
                host: host,
                username: username,
                port: port,
                privateKey: privateKey
            }
        };
    };
    return Config;
}());
main();
