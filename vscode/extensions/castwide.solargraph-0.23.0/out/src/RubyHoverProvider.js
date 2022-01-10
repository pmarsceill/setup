"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const format = require("./format");
const helper = require("./helper");
class RubyHoverProvider {
    constructor(server) {
        this.server = server;
    }
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            var workspace = helper.getDocumentWorkspaceFolder(document);
            this.server.hover(document.getText(), position.line, position.character, document.fileName, workspace).then(function (data) {
                if (data['suggestions'].length > 0) {
                    var c = '';
                    var usedPaths = [];
                    for (var i = 0; i < data['suggestions'].length; i++) {
                        var s = data['suggestions'][i];
                        if (usedPaths.indexOf(s.path) == -1) {
                            usedPaths.push(s.path);
                            c = c + "\n\n" + helper.getDocumentPageLink(s.path);
                        }
                        c = c + "\n\n";
                        var doc = s.documentation;
                        if (doc) {
                            c = c + format.htmlToPlainText(doc) + "\n\n";
                        }
                    }
                    var md = new vscode.MarkdownString(c);
                    md.isTrusted = true;
                    var hover = new vscode.Hover(md);
                    resolve(hover);
                }
                else {
                    reject();
                }
            });
        });
    }
}
exports.default = RubyHoverProvider;
//# sourceMappingURL=RubyHoverProvider.js.map