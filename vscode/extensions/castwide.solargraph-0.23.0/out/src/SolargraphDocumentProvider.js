'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SolargraphDocumentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this.docs = {};
    }
    setLanguageClient(languageClient) {
        this.languageClient = languageClient;
    }
    setServerUrl(url) {
        this.serverUrl = url;
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
    parseQuery(query) {
        var result = {};
        var parts = query.split('&');
        parts.forEach((part) => {
            var frag = part.split('=');
            result[frag[0]] = frag[1];
        });
        return result;
    }
    update(uri) {
        var that = this;
        var method = '$/solargraph' + uri.path;
        var query = this.parseQuery(uri.query);
        // TODO DRY this function
        let convertDocumentation = function (text) {
            var regexp = /\"solargraph\:(.*?)\"/g;
            var match;
            var adjusted = text;
            while (match = regexp.exec(text)) {
                var commandUri = "\"command:solargraph._openDocumentUrl?" + encodeURI(JSON.stringify("solargraph:" + match[1])) + "\"";
                adjusted = adjusted.replace(match[0], commandUri);
            }
            return adjusted;
        };
        this.languageClient.sendRequest(method, { query: query.query }).then((result) => {
            this.docs[uri.toString()] = convertDocumentation(result.content);
            this._onDidChange.fire(uri);
        });
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
}
exports.default = SolargraphDocumentProvider;
//# sourceMappingURL=SolargraphDocumentProvider.js.map