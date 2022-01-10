"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.fileListener = void 0;
const import_sort_config_1 = require("import-sort-config");
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const path_1 = require("path");
let currentWorkspaceFolder;
let cachedConfig;
const CONFIG_FILES = [
    '.importsortrc',
    '.importsortrc.json',
    '.importsortrc.yaml',
    '.importsortrc.yml',
    '.importsortrc.js',
    'package.json',
    'importsort.config.js',
];
function clearCache() {
    cachedConfig = null;
}
function fileListener() {
    const fileWatcher = vscode_1.workspace.createFileSystemWatcher(`**/{${CONFIG_FILES.join(',')}}`);
    fileWatcher.onDidChange(clearCache);
    fileWatcher.onDidCreate(clearCache);
    fileWatcher.onDidDelete(clearCache);
    return fileWatcher;
}
exports.fileListener = fileListener;
function hasWorkspaceFolderChanged(document) {
    if (!vscode_1.workspace.workspaceFolders || vscode_1.workspace.workspaceFolders.length < 2) {
        return false;
    }
    if (JSON.stringify(currentWorkspaceFolder) !==
        JSON.stringify(vscode_1.workspace.getWorkspaceFolder(document.uri))) {
        currentWorkspaceFolder = vscode_1.workspace.getWorkspaceFolder(document.uri);
        return true;
    }
    return false;
}
function getConfig(document) {
    const useCache = utils_1.getConfiguration('cache-package-json-config-checks');
    const config = utils_1.clone(import_sort_config_1.DEFAULT_CONFIGS);
    const defaultSortStyle = utils_1.getConfiguration('default-sort-style');
    Object.keys(config).forEach((key) => {
        config[key].style = `import-sort-style-${defaultSortStyle}`;
    });
    // Initialize reference to the document current workspace folder
    if (!currentWorkspaceFolder) {
        currentWorkspaceFolder = vscode_1.workspace.getWorkspaceFolder(document.uri);
    }
    if (!useCache || !cachedConfig || hasWorkspaceFolderChanged(document)) {
        cachedConfig = import_sort_config_1.getConfig(path_1.extname(document.fileName), path_1.dirname(document.fileName), config);
    }
    return cachedConfig;
}
exports.getConfig = getConfig;
//# sourceMappingURL=config-cache.js.map