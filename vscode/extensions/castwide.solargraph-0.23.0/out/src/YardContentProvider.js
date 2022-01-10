'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const request = require("request");
class YardContentProvider {
    constructor(server) {
        this.server = server;
        this._onDidChange = new vscode.EventEmitter();
        this.docs = {};
    }
    updateAll() {
        Object.keys(this.docs).forEach((uriString) => {
            this.update(vscode.Uri.parse(uriString));
        });
    }
    remove(uri) {
        delete this.docs[uri.toString()];
    }
    provideTextDocumentContent(uri) {
        if (!this.docs[uri.toString()]) {
            this.update(uri);
        }
        return this.docs[uri.toString()] || 'Loading...';
    }
    update(uri) {
        var that = this;
        request.get({ url: this.server.url + uri.path, form: {
                query: uri.query,
                workspace: vscode.workspace.rootPath
            } }, function (err, httpResponse, body) {
            that.docs[uri.toString()] = body;
            that._onDidChange.fire(uri);
        });
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
}
exports.default = YardContentProvider;
//# sourceMappingURL=YardContentProvider.js.map