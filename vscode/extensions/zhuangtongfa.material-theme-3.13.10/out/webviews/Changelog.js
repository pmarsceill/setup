"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogWebview = void 0;
const Webview_1 = require("./Webview");
const vscode_1 = require("vscode");
const util_1 = require("util");
const path = require("path");
const marked = require("marked");
class ChangelogWebview extends Webview_1.WebviewController {
    get id() {
        return 'Onedark Pro.Changelog';
    }
    get title() {
        return 'Onedark Pro theme Changelog';
    }
    get content() {
        const changelogPath = vscode_1.Uri.file(path.join(__dirname, '../../', 'CHANGELOG.md'));
        return new Promise(resolve => {
            const content = vscode_1.workspace.fs.readFile(changelogPath).then(data => {
                return new util_1.TextDecoder().decode(data);
            });
            resolve(marked(content));
        });
    }
}
exports.ChangelogWebview = ChangelogWebview;
//# sourceMappingURL=Changelog.js.map