"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefined = exports.clone = exports.getMaxRange = exports.getConfiguration = exports.EXTENSION_NAME = void 0;
const vscode_1 = require("vscode");
exports.EXTENSION_NAME = 'sort-imports';
function getConfiguration(key) {
    return vscode_1.workspace.getConfiguration(exports.EXTENSION_NAME).get(key);
}
exports.getConfiguration = getConfiguration;
function getMaxRange() {
    return new vscode_1.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}
exports.getMaxRange = getMaxRange;
function clone(object) {
    return JSON.parse(JSON.stringify(object));
}
exports.clone = clone;
function isUndefined(object) {
    return typeof object === 'undefined';
}
exports.isUndefined = isUndefined;
//# sourceMappingURL=utils.js.map