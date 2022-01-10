"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const rubocop_1 = require("./rubocop");
const configuration_1 = require("./configuration");
// entry point of extension
function activate(context) {
    'use strict';
    const diag = vscode.languages.createDiagnosticCollection('ruby');
    context.subscriptions.push(diag);
    const rubocop = new rubocop_1.Rubocop(diag);
    const disposable = vscode.commands.registerCommand('ruby.rubocop', () => {
        const document = vscode.window.activeTextEditor.document;
        rubocop.execute(document);
    });
    context.subscriptions.push(disposable);
    const ws = vscode.workspace;
    ws.onDidChangeConfiguration((0, configuration_1.onDidChangeConfiguration)(rubocop));
    ws.textDocuments.forEach((e) => {
        rubocop.execute(e);
    });
    ws.onDidOpenTextDocument((e) => {
        rubocop.execute(e);
    });
    ws.onDidSaveTextDocument((e) => {
        if (rubocop.isOnSave) {
            rubocop.execute(e);
        }
    });
    ws.onDidCloseTextDocument((e) => {
        rubocop.clear(e);
    });
    const formattingProvider = new rubocop_1.RubocopAutocorrectProvider();
    vscode.languages.registerDocumentFormattingEditProvider('ruby', formattingProvider);
    vscode.languages.registerDocumentFormattingEditProvider('gemfile', formattingProvider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map