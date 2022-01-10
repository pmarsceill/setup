'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const SolargraphDocumentProvider_1 = require("./SolargraphDocumentProvider");
const child_process = require("child_process");
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('node_modules', 'solargraph-utils', 'out', 'LanguageServer.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };
    let solargraphDocumentProvider = new SolargraphDocumentProvider_1.default();
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = () => {
        return new Promise((resolve) => {
            //let kid = solargraph.commands.solargraphCommand(['lsp'], new solargraph.Configuration());
            let kid = child_process.spawn("ruby", ["\\Users\\Fred\\Documents\\code\\solargraph\\stdio.rb"]);
            kid.stdout.on("data", (data) => {
                console.log("Received from stdio: " + data);
            });
            kid.on('exit', (code) => {
                console.log('Hey, the thing ended and shit.');
            });
            resolve(kid);
        });
    };
    /*let serverOptions: ServerOptions = {
        run : { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    }*/
    var getDocumentPageLink = function (path) {
        var uri = 'solargraph:/document?' + path.replace('#', '%23');
        var href = encodeURI('command:solargraph._openDocument?' + JSON.stringify(uri));
        var link = "[" + path + '](' + href + ')';
        return link;
    };
    var middleware = {
        provideHover: (document, position, token, next) => {
            return new Promise((resolve) => {
                var promise = next(document, position, token);
                // HACK: It's a promise, but TypeScript doesn't recognize it
                promise['then']((hover) => {
                    var contents = [];
                    hover.contents.forEach((orig) => {
                        var str = '';
                        var regexp = /\(solargraph\:(.*?)\)/g;
                        var match;
                        var adjusted = orig.value;
                        while (match = regexp.exec(orig.value)) {
                            var commandUri = "(command:solargraph._openDocumentUrl?" + encodeURI(JSON.stringify("solargraph:" + match[1])) + ")";
                            adjusted = adjusted.replace(match[0], commandUri);
                        }
                        var md = new vscode_1.MarkdownString(adjusted);
                        md.isTrusted = true;
                        contents.push(md);
                    });
                    resolve(new vscode.Hover(contents));
                });
            });
        }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'ruby' }] /*,
        synchronize: {
            // Synchronize the setting section 'lspSample' to the server
            //configurationSection: 'lspSample',
            // Notify the server about file changes to '.clientrc files contain in the workspace
            //fileEvents: workspace.createFileSystemWatcher('** /.clientrc')
        },
        middleware: middleware,
        initializationOptions: {
            viewsPath: vscode.extensions.getExtension('castwide.solargraph').extensionPath + '/views',
            useBundler: vscode.workspace.getConfiguration('solargraph').useBundler || false
        }*/
    };
    // Create the language client and start the client.
    var languageClient = new vscode_languageclient_1.LanguageClient('Ruby Language Server', serverOptions, clientOptions);
    languageClient.onReady().then(() => {
        console.log('Is it ready or WHAT???');
        /*languageClient.onNotification("$/solargraphInfo", (server) => {
            // Set the server URL in the document provider so links work
            solargraphDocumentProvider.setServerUrl(server.url);
        });*/
    });
    let disposable = languageClient.start();
    console.log('Started the damn client?');
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
    // https://css-tricks.com/snippets/javascript/get-url-variables/
    var getQueryVariable = function (query, variable) {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
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
    vscode.workspace.registerTextDocumentContentProvider('solargraph', solargraphDocumentProvider);
}
exports.activate = activate;
//# sourceMappingURL=extension.1.js.map