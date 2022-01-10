"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const request = require("request");
const cmd = require("./commands");
class RubyCompletionItemProvider {
    constructor() {
        this.server = null;
    }
    RubyCompletionProvider(server) {
        this.server = server;
    }
    provideCompletionItems(document, position) {
        return new Promise((resolve, reject) => {
            //if (solargraphServer && solargraphPort) {
            if (this.server.isRunning()) {
                request.post({ url: 'http://localhost:' + this.server.getPort() + '/suggest', form: {
                        text: document.getText(),
                        filename: document.fileName,
                        line: position.line,
                        column: position.character,
                        workspace: vscode.workspace.rootPath,
                        with_snippets: vscode.workspace.getConfiguration('solargraph').withSnippets ? 1 : null
                    }
                }, function (err, httpResponse, body) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (httpResponse.statusCode == 200) {
                            return resolve(this.getCompletionItems(JSON.parse(body), document, position));
                        }
                        else {
                            // TODO: Handle error
                        }
                    }
                });
            }
            else {
                let child = cmd.solargraphCommand([
                    'suggest',
                    '--line=' + position.line,
                    '--column=' + position.character,
                    '--filename=' + document.fileName
                ]);
                let errbuf = [], outbuf = [];
                child.stderr.on('data', (data) => {
                    console.log(data.toString());
                    errbuf.push(data);
                });
                child.stdout.on('data', (data) => outbuf.push(data));
                child.on('exit', () => {
                    var data = outbuf.join('');
                    if (data == "") {
                        return resolve([]);
                    }
                    else {
                        let result = JSON.parse(data);
                        return resolve(this.getCompletionItems(result, document, position));
                    }
                });
                child.on('error', () => {
                    if (errbuf.length) {
                        console.log(errbuf.join("\n"));
                    }
                });
                child.stdin.end(document.getText());
            }
        });
    }
    getCompletionItems(data, document, position) {
        const kinds = {
            "Class": vscode.CompletionItemKind.Class,
            "Keyword": vscode.CompletionItemKind.Keyword,
            "Module": vscode.CompletionItemKind.Module,
            "Method": vscode.CompletionItemKind.Method,
            "Variable": vscode.CompletionItemKind.Variable,
            "Snippet": vscode.CompletionItemKind.Snippet
        };
        // HACK: Tricking the type system to avoid an invalid error
        let SnippetString = vscode['SnippetString'];
        let items = [];
        if (data.status == "ok") {
            var range = document.getWordRangeAtPosition(position);
            if (range) {
                var repl = document.getText(range);
                if (range.start.character > 0) {
                    if (repl.substr(0, 1) == ':') {
                        var prevChar = document.getText(new vscode.Range(range.start.line, range.start.character - 1, range.start.line, range.start.character));
                        if (prevChar == ':') {
                            // Replacement range starts with a colon, but there's
                            // a previous colon. That means we're in a namespace,
                            // not a symbol. Get rid of the colon in the namespace
                            // range.
                            range = new vscode.Range(range.start.line, range.start.character + 1, range.end.line, range.end.character);
                        }
                    }
                }
            }
            data.suggestions.forEach((cd) => {
                var item = new vscode.CompletionItem(cd['label'], kinds[cd['kind']]);
                // Treat instance variables slightly differently
                if (cd['insert'].substring(0, 1) == '@') {
                    item.insertText = cd['insert'].substring(1);
                    item.filterText = cd['insert'].substring(1);
                    item.sortText = cd['insert'].substring(1);
                    item.label = cd['insert'].substring(1);
                }
                if (cd['kind'] == 'Snippet') {
                    item.insertText = new SnippetString(cd['insert']);
                }
                else {
                    item.insertText = cd['insert'];
                }
                if (range) {
                    // HACK: Unrecognized property
                    item['range'] = range;
                }
                item.detail = cd['detail'];
                item.documentation = cd['documentation'];
                items.push(item);
            });
        }
        return items;
    }
}
exports.default = RubyCompletionItemProvider;
//# sourceMappingURL=RubyCompletionProvider.js.map