"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const format = require("./format");
const helper = require("./helper");
class RubySignatureHelpProvider {
    constructor(server) {
        this.server = server;
    }
    provideSignatureHelp(document, position, token) {
        return new Promise((resolve, reject) => {
            var workspace = helper.getDocumentWorkspaceFolder(document);
            this.server.signify(document.getText(), position.line, position.character, document.fileName, workspace).then(function (data) {
                var help = new vscode.SignatureHelp();
                data['suggestions'].forEach((s) => {
                    var doc = s.documentation;
                    if (s.params && s.params.length > 0) {
                        doc += "<p>Params:<br/>";
                        for (var j = 0; j < s.params.length; j++) {
                            doc += "- " + s.params[j] + "<br/>";
                        }
                        doc += "</p>";
                    }
                    var info = new vscode.SignatureInformation(s.label + '(' + s.arguments.join(', ') + ')', format.htmlToPlainText(doc));
                    help.signatures.push(info);
                });
                if (help.signatures.length > 0) {
                    help.activeSignature = 0;
                }
                return resolve(help);
            });
        });
    }
}
exports.default = RubySignatureHelpProvider;
//# sourceMappingURL=RubySignatureHelpProvider.js.map