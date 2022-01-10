"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
require("date-format-lite");
const INPUT_PROMPT = "Date and Time format";
const DEFAULT_FORMAT = "YYYY-MM-DD hh:mm:ss";
function getConfiguredFormat(format = "format") {
    const insertDateStringConfiguration = vscode_1.workspace.getConfiguration("insertDateString");
    return insertDateStringConfiguration.get(format, DEFAULT_FORMAT);
}
function getFormattedDateString(userFormat = getConfiguredFormat()) {
    const now = new Date();
    return now.format(userFormat);
}
function replaceEditorSelection(text) {
    const editor = vscode_1.window.activeTextEditor;
    if (editor) {
        const selections = editor.selections;
        editor.edit((editBuilder) => {
            selections.forEach((selection) => {
                editBuilder.replace(selection, "");
                editBuilder.insert(selection.active, text);
            });
        });
    }
}
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand("insertDateString.insertDateTime", () => replaceEditorSelection(getFormattedDateString())));
    context.subscriptions.push(vscode_1.commands.registerCommand("insertDateString.insertDate", () => replaceEditorSelection(getFormattedDateString(getConfiguredFormat("formatDate")))));
    context.subscriptions.push(vscode_1.commands.registerCommand("insertDateString.insertTime", () => replaceEditorSelection(getFormattedDateString(getConfiguredFormat("formatTime")))));
    context.subscriptions.push(vscode_1.commands.registerCommand("insertDateString.insertTimestamp", () => replaceEditorSelection(new Date().getTime().toString())));
    context.subscriptions.push(vscode_1.commands.registerCommand("insertDateString.insertOwnFormatDateTime", () => {
        vscode_1.window
            .showInputBox({
            value: getConfiguredFormat(),
            prompt: INPUT_PROMPT,
        })
            .then((format) => {
            replaceEditorSelection(getFormattedDateString(format));
        });
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map