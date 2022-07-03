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
var core = require("@actions/core");
var Client = require("node-scp");
var process_1 = require("process");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var host, username, path, port, privateKey, client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    host = core.getInput("host");
                    username = core.getInput("user");
                    path = core.getInput("path");
                    port = parseInt(core.getInput("port"));
                    privateKey = core.getInput("private_key");
                    return [4 /*yield*/, getClient(host, port, username, privateKey)];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.exists(path)];
                case 2:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, client.mkdir(path)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, client.exists(path + "/4000")];
                case 5:
                    if (!!(_a.sent())) return [3 /*break*/, 7];
                    return [4 /*yield*/, client.mkdir(path + "/4000")];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: 
                // push dist-folder content to build-file
                return [4 /*yield*/, client.uploadDir("./dist", path + "/4000")];
                case 8:
                    // push dist-folder content to build-file
                    _a.sent();
                    /**
                     * 2. push /dist folder content to this folder
                     */
                    // 3. Create folder in versionsk
                    client.close();
                    (0, process_1.exit)(0);
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    core.setFailed(error_1.message);
                    (0, process_1.exit)(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getClient(host, port, username, privateKey) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Client.Client({
                        host: host,
                        port: port,
                        username: username,
                        privateKey: privateKey
                    })];
                case 1:
                    client = _a.sent();
                    //    await client.mkdir(path)
                    //    client.close() // remember to close connection after you finish
                    return [2 /*return*/, client];
            }
        });
    });
}
main();
