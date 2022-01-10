"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const sort_1 = require("./sort");
const errorHandler_1 = require("./errorHandler");
const utils_1 = require("./utils");
const config_cache_1 = require("./config-cache");
const on_save_1 = require("./on-save");
function activate({ subscriptions }) {
    subscriptions.push(vscode_1.commands.registerCommand(utils_1.EXTENSION_NAME + '.sort', sort_1.sortCurrentDocument), vscode_1.commands.registerCommand(`${utils_1.EXTENSION_NAME}.save-without-sorting`, sort_1.saveWithoutSorting), config_cache_1.fileListener(), errorHandler_1.setupErrorHandler(), vscode_1.window.onDidChangeActiveTextEditor((editor) => {
        errorHandler_1.toggleStatusBarItem(editor);
    }));
    on_save_1.default.update();
    vscode_1.workspace.onDidChangeWorkspaceFolders(() => on_save_1.default.update());
    vscode_1.workspace.onDidChangeConfiguration(() => on_save_1.default.update());
}
exports.activate = activate;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map