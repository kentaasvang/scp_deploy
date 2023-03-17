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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
var serverClient_1 = require("./clients/serverClient");
var fs = require("fs"), core = require("@actions/core"), logger = require("pino")({
    level: "debug"
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, client, action, configLogSafe, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    config = ClientSettings.get();
                    client = new serverClient_1.ServerClient(config, logger);
                    action = new Action(client);
                    configLogSafe = __assign(__assign({}, config), { privateKey: "***" });
                    logger.info("Created client w/ config: ".concat(JSON.stringify(configLogSafe)));
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
    function Action(client) {
        this.client = client;
    }
    Action.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.deploy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Action;
}());
var ClientSettings = /** @class */ (function () {
    function ClientSettings() {
    }
    ClientSettings.get = function () {
        // const host: string = core.getInput("host");
        // const username: string = core.getInput("user");
        // const port: number = parseInt(core.getInput("port"));
        // const privateKey: string = core.getInput("private_key");
        // const sourceFolder: string = core.getInput("source_folder");
        // const destinationFolder: string = core.getInput("destination_folder");
        // for testing
        var host = "lagdincv.no";
        var username = "kent";
        var port = 22;
        var privateKey = fs.readFileSync("./private_key/id_rsa", "utf-8");
        var sourceFolder = "./dist";
        var destinationFolder = "/home/kent/scp_deploy_test";
        return {
            host: host,
            username: username,
            port: port,
            privateKey: privateKey,
            sourceFolder: sourceFolder,
            destinationFolder: destinationFolder,
        };
    };
    return ClientSettings;
}());
main();
