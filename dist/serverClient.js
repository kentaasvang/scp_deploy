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
exports.ServerClient = void 0;
var node_scp_1 = require("node-scp");
var process_1 = require("process");
var SSH = require("simple-ssh");
var ServerClient = /** @class */ (function () {
    function ServerClient(config) {
        this.serverConfig = config.serverConfig;
        this.attributes = config.attributes;
    }
    ServerClient.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, (0, node_scp_1["default"])({
                                host: this.serverConfig.host,
                                port: this.serverConfig.port,
                                username: this.serverConfig.username,
                                privateKey: this.serverConfig.privateKey
                            })];
                    case 1:
                        _a.clientInstance = _b.sent();
                        return [4 /*yield*/, this.workingDirectoryExists()];
                    case 2:
                        /**
                         * if not versioning
                         *      delete content of public folder
                         *      upload new files to public folder
                         *
                         * if versioning
                         *      create new folder with version as name
                         *      upload files to publish files to new folder
                         */
                        if (!(_b.sent()))
                            return [2 /*return*/];
                        if (!this.attributes.versioning) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.checkNeededDirectoriesExists()];
                    case 3:
                        if (!(_b.sent()))
                            (0, process_1.exit)(1);
                        return [4 /*yield*/, this.generateNewVersionNumber()];
                    case 4:
                        version = _b.sent();
                        this.attributes.workingDirectory = this.attributes.versionsDirectory + "/" + version;
                        return [4 /*yield*/, this.clientInstance.mkdir(this.attributes.workingDirectory)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.createSymlinkFromWorkingDirToCurrent()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [4 /*yield*/, this.upload()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.close()];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerClient.prototype.checkNeededDirectoriesExists = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, dirNames, pubDir, workDir;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.list(this.attributes.workingDirectory))];
                    case 1:
                        result = _b.sent();
                        dirNames = this.getNamesFromList(result);
                        pubDir = dirNames.find(function (dir) { return dir == "Current"; });
                        workDir = dirNames.find(function (dir) { return dir == "Versions"; });
                        if (pubDir === undefined || workDir === undefined) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ServerClient.prototype.generateNewVersionNumber = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var versionFolders, dirNames, dirNamesAsNumber;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.list(this.attributes.versionsDirectory))];
                    case 1:
                        versionFolders = _b.sent();
                        dirNames = this.getNamesFromList(versionFolders);
                        if (dirNames.length == 0)
                            return [2 /*return*/, 1];
                        dirNamesAsNumber = [];
                        dirNames.forEach(function (dirName) {
                            dirNamesAsNumber.push(parseInt(dirName, 10));
                        });
                        // sort in ascending order
                        dirNamesAsNumber.sort(function (a, b) { return a - b; });
                        console.log(dirNamesAsNumber);
                        return [2 /*return*/, ++dirNamesAsNumber[dirNamesAsNumber.length - 1]];
                }
            });
        });
    };
    ServerClient.prototype.getNamesFromList = function (result) {
        var dirNames = [];
        Object.keys(result).forEach(function (idx) {
            dirNames.push(result[idx].name);
        });
        return dirNames;
    };
    ServerClient.prototype.workingDirectoryExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.clientInstance === undefined) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.clientInstance.exists(this.attributes.workingDirectory)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ServerClient.prototype.upload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deployFiles, workingdirectory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.clientInstance === undefined) {
                            return [2 /*return*/];
                        }
                        deployFiles = this.attributes.sourceFolder;
                        workingdirectory = this.attributes.workingDirectory;
                        return [4 /*yield*/, this.clientInstance.uploadDir(deployFiles, workingdirectory)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ServerClient.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.clientInstance === undefined) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.clientInstance.close()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ServerClient.prototype.createSymlinkFromWorkingDirToCurrent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssh;
            return __generator(this, function (_a) {
                ssh = new SSH({
                    host: this.serverConfig.host,
                    user: this.serverConfig.username,
                    key: this.serverConfig.privateKey
                });
                ssh.exec("ln -sfn /home/headline/Versions/1 /home/headline/Current", {
                    out: function (out) {
                        console.log(out);
                    }
                }).start();
                return [2 /*return*/];
            });
        });
    };
    return ServerClient;
}());
exports.ServerClient = ServerClient;
