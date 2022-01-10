"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const sort_1 = require("./sort");
let subscription;
class OnSave {
    static get isEnabled() {
        return utils_1.getConfiguration('on-save');
    }
    static register() {
        if (subscription) {
            return;
        }
        subscription = vscode_1.workspace.onWillSaveTextDocument(OnSave.listener.bind(this));
    }
    static unregister() {
        if (!subscription) {
            return;
        }
        subscription.dispose();
        subscription = null;
    }
    static update() {
        if (OnSave.isEnabled) {
            OnSave.register();
        }
        else {
            OnSave.unregister();
        }
    }
    static bypass(action) {
        OnSave.unregister();
        const result = action();
        return result.then((res) => {
            OnSave.update();
            return res;
        });
    }
    static listener({ document, waitUntil }) {
        const sortedText = sort_1.sort(document);
        if (!sortedText) {
            return;
        }
        waitUntil(OnSave.changeContentOfDocument(document, sortedText));
    }
    static changeContentOfDocument(document, sortedText) {
        const editor = vscode_1.window.activeTextEditor;
        const savingActiveDocument = document === editor.document;
        const maxRange = utils_1.getMaxRange();
        if (savingActiveDocument) {
            return editor.edit((edit) => {
                edit.replace(maxRange, sortedText);
            });
        }
        return Promise.resolve([new vscode_1.TextEdit(maxRange, sortedText)]);
    }
}
exports.default = OnSave;
//# sourceMappingURL=on-save.js.map