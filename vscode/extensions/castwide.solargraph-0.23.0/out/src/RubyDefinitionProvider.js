"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helper = require("./helper");
class RubyDefinitionProvider {
    constructor(server) {
        this.server = null;
        this.server = server;
    }
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => {
            var workspace = helper.getDocumentWorkspaceFolder(document);
            this.server.define(document.getText(), position.line, position.character, document.fileName, workspace).then(function (data) {
                if (data['status'] == 'ok') {
                    var result = [];
                    data['suggestions'].forEach((s) => {
                        if (s['location']) {
                            var match = s['location'].match(/^(.*?):([0-9]*?):([0-9]*)$/);
                            var uri = vscode.Uri.file(match[1]);
                            if (uri) {
                                var location = new vscode.Location(uri, new vscode.Position(parseInt(match[2]), parseInt(match[3])));
                                result.push(location);
                            }
                        }
                    });
                    resolve(result);
                }
                else {
                    reject();
                }
            });
        });
    }
}
exports.default = RubyDefinitionProvider;
//# sourceMappingURL=RubyDefinitionProvider.js.map