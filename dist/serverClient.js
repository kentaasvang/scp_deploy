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
    function ServerClient(config, logger) {
        this.serverConfig = config.serverConfig;
        this.attributes = config.attributes;
        this.logger = logger;
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
                        return [4 /*yield*/, this.directoryExists(this.attributes.destinationFolder)];
                    case 2:
                        if (!!(_b.sent())) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createDirectory(this.attributes.destinationFolder)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!this.attributes.versioning) return [3 /*break*/, 8];
                        this.logger.info("Deploying with versioning");
                        return [4 /*yield*/, this.getVersion()];
                    case 5:
                        version = _b.sent();
                        this.attributes.destinationFolder += "/".concat(version);
                        this.logger.info("Changed destinationFolder to ".concat(this.attributes.destinationFolder));
                        return [4 /*yield*/, this.createDirectory(this.attributes.destinationFolder, true)];
                    case 6:
                        _b.sent();
                        this.logger.info("Created folder with ".concat(this.attributes.destinationFolder, " on remote server"));
                        if (!this.attributes.createSymlink) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.createSymlink(this.attributes.destinationFolder, this.attributes.publicDirectory)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, this.upload()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this.closeConnection()];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerClient.prototype.directoryExists = function (path) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.exists(path))];
                    case 1:
                        result = _b.sent();
                        this.logger.info("Checking to see if '".concat(path, "' exists, result was: ").concat(result));
                        return [2 /*return*/, result !== false];
                }
            });
        });
    };
    ServerClient.prototype.createDirectory = function (dirPath, force) {
        var _a;
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.attributes.createFolders && !force) {
                            this.logger.error("Can't create folder '".concat(dirPath, "' with create folder-attr set to ").concat(this.attributes.createFolders));
                            (0, process_1.exit)(1);
                        }
                        this.logger.info("Creating new directory: '".concat(dirPath));
                        return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.mkdir(dirPath))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerClient.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var versions, versionsAsNumbers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getExistingVersions()];
                    case 1:
                        versions = _a.sent();
                        if (versions.length == 0) {
                            this.logger.info("No prior versions found, initiating first version number 1");
                            return [2 /*return*/, 1];
                        }
                        versionsAsNumbers = [];
                        // parse string to ints and push to array
                        versions.forEach(function (version) {
                            versionsAsNumbers.push(parseInt(version, 10));
                        });
                        // sort array in ascending order
                        versionsAsNumbers.sort(function (a, b) { return a - b; });
                        return [2 /*return*/, ++versionsAsNumbers[versionsAsNumbers.length - 1]];
                }
            });
        });
    };
    ServerClient.prototype.getExistingVersions = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var versions, dirNames;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.list(this.attributes.destinationFolder))];
                    case 1:
                        versions = _b.sent();
                        dirNames = this.getNamesFromList(versions);
                        return [2 /*return*/, dirNames];
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
    ServerClient.prototype.upload = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sourceFolder, destinationFolder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sourceFolder = this.attributes.sourceFolder;
                        destinationFolder = this.attributes.destinationFolder;
                        return [4 /*yield*/, this.cleanDirectory(destinationFolder)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.uploadDir(sourceFolder, destinationFolder))];
                    case 2:
                        _b.sent();
                        this.logger.info("Uploaded source-files to '".concat(destinationFolder, "'"));
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerClient.prototype.cleanDirectory = function (workingDirectory) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.emptyDir(workingDirectory))];
                    case 1:
                        _b.sent();
                        this.logger.info("Cleaned directory '".concat(workingDirectory, "'"));
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerClient.prototype.closeConnection = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.info("Closing connection to server..");
                        return [4 /*yield*/, ((_a = this.clientInstance) === null || _a === void 0 ? void 0 : _a.close())];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ServerClient.prototype.createSymlink = function (source, symlinkName) {
        return __awaiter(this, void 0, void 0, function () {
            var ssh;
            return __generator(this, function (_a) {
                if (symlinkName === undefined) {
                    this.logger.error("symlinkName is undefined");
                    (0, process_1.exit)(1);
                }
                this.logger.info("Creating symbolic link ".concat(symlinkName, " from ").concat(source));
                ssh = new SSH({
                    host: this.serverConfig.host,
                    user: this.serverConfig.username,
                    key: this.serverConfig.privateKey
                });
                ssh.exec("ln -sfn ".concat(source, " ").concat(symlinkName), {
                    out: function (out) {
                        this.logger.info(out);
                    }
                }).start();
                return [2 /*return*/];
            });
        });
    };
    return ServerClient;
}());
exports.ServerClient = ServerClient;
