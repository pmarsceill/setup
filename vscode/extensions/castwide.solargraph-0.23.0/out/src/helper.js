"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function getDocumentWorkspaceFolder(document) {
    var folder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (folder) {
        return folder.uri.fsPath;
    }
    else if (vscode.workspace.workspaceFolders.length > 0) {
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    else {
        return null;
    }
}
exports.getDocumentWorkspaceFolder = getDocumentWorkspaceFolder;
function getDocumentPageLink(path) {
    var uri = 'solargraph:/document?' + path.replace('#', '%23');
    var href = encodeURI('command:solargraph._openDocument?' + JSON.stringify(uri));
    var link = "[" + path + '](' + href + ')';
    return link;
}
exports.getDocumentPageLink = getDocumentPageLink;
//# sourceMappingURL=helper.js.map