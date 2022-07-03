"use strict";
exports.__esModule = true;
var core = require("@actions/core");
try {
    var host = core.getInput("host");
    var user = core.getInput("user");
    var password = core.getInput("password");
    console.log("host: ".concat(host));
    console.log("user: ".concat(user));
    console.log("password: ".concat(password));
}
catch (error) {
    core.setFailed(error.message);
}
