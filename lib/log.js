"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var log = function (prefix, color) { return function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    console.log(color.apply(void 0, [prefix].concat(rest)));
}; };
var warn = log('[LOCAL2CDN][WARN]', chalk.yellow);
var info = log('[LOCAL2CDN][INFO]', chalk.green);
var note = log('[LOCAL2CDN][NOTE]', chalk.magenta);
var error = log('[LOCAL2CDN][ERROR]', chalk.red);
exports.default = { warn: warn, info: info, note: note, error: error };
