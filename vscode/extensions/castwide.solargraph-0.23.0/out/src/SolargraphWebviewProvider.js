"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SolargraphWebviewProvider {
    constructor() {
        this.views = {};
    }
    parseQuery(query) {
        var result = {};
        var parts = query.split('&');
        parts.forEach((part) => {
            var frag = part.split('=');
            result[decodeURIComponent(frag[0])] = decodeURIComponent(frag[1]);
        });
        return result;
    }
    open(uri) {
        var uriString = uri.toString();
        var method = '$/solargraph' + uri.path;
        var query = this.parseQuery(uri.query.replace(/=/g, '%3D').replace(/\%$/, '%25').replace(/query\%3D/, 'query='));
        if (!this.views[uriString]) {
            this.views[uriString] = vscode.window.createWebviewPanel('solargraph', uriString, vscode.ViewColumn.Two, { enableCommandUris: true });
            this.views[uriString].onDidDispose(() => {
                delete this.views[uriString];
            });
            this.views[uriString].webview.html = 'Loading...';
        }
        this.languageClient.sendRequest(method, query).then((result) => {
            if (this.views[uriString]) {
                var converted = this.convertDocumentation(result.content);
                this.views[uriString].webview.html = converted;
            }
        });
    }
    setLanguageClient(lc) {
        this.languageClient = lc;
    }
    convertDocumentation(text) {
        var regexp = /\"solargraph\:(.*?)\"/g;
        var match;
        var adjusted = text;
        while (match = regexp.exec(text)) {
            var commandUri = "\"command:solargraph._openDocumentUrl?" + encodeURI(JSON.stringify("solargraph:" + match[1])) + "\"";
            adjusted = adjusted.replace(match[0], commandUri);
        }
        return adjusted;
    }
    ;
}
exports.default = SolargraphWebviewProvider;
//# sourceMappingURL=SolargraphWebviewProvider.js.map