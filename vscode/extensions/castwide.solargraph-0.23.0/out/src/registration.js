"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function registerCommands(context) {
    // https://css-tricks.com/snippets/javascript/get-url-variables/
    var getQueryVariable = function (query, variable) {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    };
    // Open command (used internally for browsing documentation pages)
    var disposableOpen = vscode.commands.registerCommand('solargraph._openDocument', (uriString) => {
        var uri = vscode.Uri.parse(uriString);
        var label = (uri.path == '/search' ? 'Search for ' : '') + getQueryVariable(uri.query, "query");
        vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, label);
    });
    context.subscriptions.push(disposableOpen);
    // Open URL command (used internally for browsing documentation pages)
    var disposableOpenUrl = vscode.commands.registerCommand('solargraph._openDocumentUrl', (uriString) => {
        var uri = vscode.Uri.parse(uriString);
        var label = (uri.path == '/search' ? 'Search for ' : '') + getQueryVariable(uri.query, "query");
        vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, label);
    });
    context.subscriptions.push(disposableOpenUrl);
    // Restart command
    var disposableRestart = vscode.commands.registerCommand('solargraph.restart', () => {
        restartLanguageServer().then(() => {
            vscode.window.showInformationMessage('Solargraph server restarted.');
        });
    });
    context.subscriptions.push(disposableRestart);
    // Search command
    var disposableSearch = vscode.commands.registerCommand('solargraph.search', () => {
        vscode.window.showInputBox({ prompt: 'Search Ruby documentation:' }).then(val => {
            if (val) {
                var uri = 'solargraph:/search?query=' + encodeURIComponent(val);
                vscode.commands.executeCommand('solargraph._openDocument', uri);
            }
        });
    });
    context.subscriptions.push(disposableSearch);
    // Check gem version command
    var disposableCheckGemVersion = vscode.commands.registerCommand('solargraph.checkGemVersion', () => {
        // languageClient.sendNotification('$/solargraph/checkGemVersion', { verbose: true });
        solargraph.verifyGemIsCurrent(solargraphConfiguration).then((result) => {
            if (result) {
                vscode.window.showInformationMessage('The Solargraph gem is up to date.');
            }
            else {
                notifyGemUpdate();
            }
        }).catch(() => {
            console.log('An error occurred checking the Solargraph gem version.');
        });
    });
    context.subscriptions.push(disposableSearch);
    // Build gem documentation command
    var disposableBuildGemDocs = vscode.commands.registerCommand('solargraph.buildGemDocs', () => {
        languageClient.sendNotification('$/solargraph/documentGems', { rebuild: false });
    });
    context.subscriptions.push(disposableBuildGemDocs);
    // Rebuild gems documentation command
    var disposableRebuildAllGemDocs = vscode.commands.registerCommand('solargraph.rebuildAllGemDocs', () => {
        languageClient.sendNotification('$/solargraph/documentGems', { rebuild: true });
    });
    context.subscriptions.push(disposableRebuildAllGemDocs);
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=registration.js.map