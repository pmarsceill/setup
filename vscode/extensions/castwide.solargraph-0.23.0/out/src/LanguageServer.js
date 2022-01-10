'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const solargraph = require("solargraph-utils");
const files_1 = require("vscode-languageserver/lib/files");
const format = require("./format");
//import * as helper from './helper';
let solargraphConfiguration = new solargraph.Configuration();
let solargraphServer = new solargraph.Server(solargraphConfiguration);
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
let workspaceRoot;
connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    solargraphConfiguration.workspace = workspaceRoot;
    solargraphServer.start().then(() => {
        solargraphServer.prepare(workspaceRoot);
    });
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ':', '@']
            },
            hoverProvider: true
        }
    };
});
documents.onDidChangeContent((change) => {
    // TODO: This might not be necessary given that completion requests send
    // the document text, and this update function only reloads the version on
    // disk.
    //solargraphServer.update(uriToFilePath(change.document.uri), workspaceRoot);
});
connection.onDidChangeConfiguration((change) => {
    // TODO: Handle a configuration change
});
var getDocumentPageLink = function (path) {
    var uri = 'solargraph:/document?' + path.replace('#', '%23');
    uri = "solargraph:" + solargraphServer.port + "/document?workspace=" + encodeURI(workspaceRoot) + "&query=" + path.replace('#', '%23');
    console.log('URI: ' + uri);
    var href = encodeURI('command:solargraph._openDocumentUrl?' + JSON.stringify(uri));
    var link = "[" + path + '](' + href + ')';
    return link;
};
var formatDocumentation = function (doc) {
    return { kind: 'markdown', value: doc };
};
var setDocumentation = function (item, cd) {
    var docLink = '';
    if (cd['path']) {
        docLink = "\n\n" + getDocumentPageLink(cd.path) + "\n\n";
    }
    var doc = docLink + format.htmlToPlainText(cd['documentation']);
    if (cd['params'] && cd['params'].length > 0) {
        doc += "\nParams:\n";
        for (var j = 0; j < cd['params'].length; j++) {
            doc += "- " + cd['params'][j] + "\n";
        }
    }
    var md = formatDocumentation(doc);
    item.documentation = md;
};
var getBeginningPositionOfWord = function (doc, end) {
    var newChar = end.character;
    var cursor = newChar - 1;
    while (cursor >= 0) {
        var offset = doc.offsetAt({ line: end.line, character: cursor });
        var char = doc.getText().substr(offset, 1);
        if (char.match(/[a-z0-9_@\$]/i)) {
            newChar = cursor;
            cursor--;
        }
        else {
            break;
        }
    }
    return {
        line: end.line,
        character: newChar
    };
};
connection.onCompletion((textDocumentPosition) => {
    let doc = documents.get(textDocumentPosition.textDocument.uri);
    let begin = getBeginningPositionOfWord(doc, textDocumentPosition.position);
    let filename = files_1.uriToFilePath(doc.uri);
    return new Promise((resolve) => {
        solargraphServer.suggest(doc.getText(), textDocumentPosition.position.line, textDocumentPosition.position.character, filename, workspaceRoot).then((results) => {
            var items = [];
            results['suggestions'].forEach((sugg) => {
                var item = vscode_languageserver_1.CompletionItem.create(sugg.label);
                item.kind = vscode_languageserver_1.CompletionItemKind[sugg.kind];
                item.textEdit = {
                    range: {
                        start: begin,
                        end: textDocumentPosition.position
                    },
                    newText: sugg.insert
                };
                if (sugg.documentation) {
                    item.documentation = formatDocumentation(sugg.documentation);
                }
                else if (sugg.has_doc) {
                    item.documentation = 'Loading...';
                }
                else {
                    item.documentation = "\n" + sugg.path;
                }
                if (sugg['kind'] == 'Method' && sugg['arguments'].length > 0) {
                    item.detail = '(' + sugg['arguments'].join(', ') + ') ' + (sugg['return_type'] ? '=> ' + sugg['return_type'] : '');
                }
                else {
                    item.detail = (sugg['return_type'] ? '=> ' + sugg['return_type'] : '');
                }
                item.data = {};
                item.data.path = sugg['path'];
                item.data.textDocument = doc;
                items.push(item);
            });
            resolve(items);
        }).catch((err) => {
            console.log('Error: ' + JSON.stringify(err));
        });
    });
});
connection.onHover((textDocumentPosition) => {
    return new Promise((resolve, reject) => {
        let document = documents.get(textDocumentPosition.textDocument.uri);
        let filename = files_1.uriToFilePath(document.uri);
        solargraphServer.define(document.getText(), textDocumentPosition.position.line, textDocumentPosition.position.character, filename, workspaceRoot).then(function (data) {
            if (data['suggestions'].length > 0) {
                var c = '';
                var usedPaths = [];
                for (var i = 0; i < data['suggestions'].length; i++) {
                    var s = data['suggestions'][i];
                    if (usedPaths.indexOf(s.path) == -1) {
                        usedPaths.push(s.path);
                        c = c + "\n\n" + getDocumentPageLink(s.path);
                        if (s.return_type && s.kind != 'Class' && s.kind != 'Module') {
                            c = c + " => " + getDocumentPageLink(s.return_type);
                        }
                    }
                    c = c + "\n\n";
                    var doc = s.documentation;
                    if (doc) {
                        c = c + format.htmlToPlainText(doc) + "\n\n";
                    }
                }
                resolve({ contents: { kind: 'markdown', value: c } });
            }
            else {
                reject();
            }
        });
    });
});
var formatMultipleSuggestions = function (cds) {
    var doc = '';
    var docLink = '';
    cds.forEach((cd) => {
        if (!docLink && cd.path) {
            docLink = "\n\n" + getDocumentPageLink(cd.path) + "\n\n";
        }
        doc += "\n" + format.htmlToPlainText(cd.documentation);
    });
    return formatDocumentation(docLink + doc);
};
connection.onCompletionResolve((item) => {
    return new Promise((resolve, reject) => {
        if (item.documentation && item.documentation != 'Loading...') {
            resolve(item);
        }
        else if (item.documentation == 'Loading...') {
            console.log('Getting stuff from ' + workspaceRoot + ' for ' + item.data['path']);
            solargraphServer.resolve(item.data.path, workspaceRoot).then((result) => {
                if (result.suggestions.length > 0) {
                    var tmp = formatMultipleSuggestions(result.suggestions);
                    item.documentation = tmp;
                }
                else {
                    item.documentation = '';
                }
                resolve(item);
            }).catch((result) => {
                reject(result);
            });
        }
        else {
            resolve(item);
        }
    });
});
connection.onExit(() => {
    solargraphServer.stop();
});
connection.listen();
//# sourceMappingURL=LanguageServer.js.map