"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var log_1 = require("./log");
var _cache = {};
var _rootdir = path_1.join(__dirname, '../../../');
var _dbpath = path_1.join(_rootdir, '.local2cdn.cache');
/**
 * init read file
 */
fs_1.readFile(_dbpath, 'utf8', function (err, content) {
    if (!err) {
        try {
            var cache = JSON.parse(content);
            for (var key in cache) {
                _cache[key] = cache[key];
            }
            flush();
        }
        catch (err) {
            log_1.default.warn("failed to read cache file: " + _dbpath + ", for:", err.message);
        }
    }
    else {
        log_1.default.warn("failed to read cache file: " + _dbpath + ", for:", err.message);
    }
});
/**
 * async flush
 */
var flush = function () {
    var content = JSON.stringify(_cache, null, 2);
    fs_1.writeFile(_dbpath, content, function (err) {
        if (err) {
            log_1.default.error("failed to write cache file: " + _dbpath + ", for:", err.message);
        }
    });
};
/**
 * get catch
 */
var get = function (key, path) {
    if (key) {
        var data = _cache[key];
        if (data) {
            if (path && !data.paths.includes(path)) {
                data.paths.push(path);
                flush();
            }
            return data.value;
        }
    }
    return null;
};
/**
 * set catch
 */
var set = function (key, value, path) {
    if (key) {
        _cache[key] = { value: value };
        if (path)
            _cache[key].paths = [path];
        flush();
        return true;
    }
    return false;
};
exports.default = { get: get, set: set };
