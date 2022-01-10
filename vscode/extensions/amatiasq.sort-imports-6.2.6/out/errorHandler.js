"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandler = exports.safeExecution = exports.addToOutput = exports.toggleStatusBarItem = void 0;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const sort_1 = require("./sort");
let statusBarItem;
let outputChannel;
const supportedLanguages = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
];
function toggleStatusBarItem(editor) {
    if (utils_1.isUndefined(statusBarItem)) {
        return;
    }
    if (!utils_1.isUndefined(editor)) {
        // The function will be triggered every time the active "editor" instance changes
        // It also triggers when we focus on the output panel or on the debug panel
        // Both are seen as an "editor".
        // The following check will ignore such panels
        if (['debug', 'output'].some((part) => editor.document.uri.scheme === part)) {
            return;
        }
        const fileName = !editor.document.isUntitled && editor.document.fileName;
        const skip = fileName && sort_1.skipFileSorting(fileName);
        if (!skip && supportedLanguages.includes(editor.document.languageId)) {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
    else {
        statusBarItem.hide();
    }
}
exports.toggleStatusBarItem = toggleStatusBarItem;
/**
 * Update the statusBarItem message and show the statusBarItem
 *
 * @param message The message to put inside the statusBarItem
 */
function updateStatusBar(message) {
    statusBarItem.text = message;
    statusBarItem.show();
}
/**
 * Adds the filepath to the error message
 *
 * @param msg The original error message
 * @param fileName The path to the file
 * @returns {string} enhanced message with the filename
 */
function addFilePath(msg, fileName) {
    const lines = msg.split('\n');
    if (lines.length > 0) {
        lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`);
        return lines.join('\n');
    }
    return msg;
}
/**
 * Append messages to the output channel and format it with a title
 *
 * @param message The message to append to the output channel
 */
function addToOutput(message) {
    const title = `${new Date().toLocaleString()}:`;
    // Create a sort of title, to differentiate between messages
    outputChannel.appendLine(title);
    outputChannel.appendLine('-'.repeat(title.length));
    // Append actual output
    outputChannel.appendLine(`${message}\n`);
}
exports.addToOutput = addToOutput;
/**
 * Execute a callback safely, if it doesn't work, return default and log messages.
 *
 * @param cb The function to be executed,
 * @param defaultText The default value if execution of the cb failed
 * @param fileName The filename of the current document
 * @returns {string} formatted text or defaultText
 */
function safeExecution(cb, defaultText, fileName) {
    try {
        updateStatusBar('Sort Imports: $(check)');
        return cb();
    }
    catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        addToOutput(addFilePath(err.message, fileName));
        updateStatusBar('Sort Imports: $(x)');
        return defaultText;
    }
}
exports.safeExecution = safeExecution;
/**
 * Setup the output channel and the statusBarItem.
 * Create a command to show the output channel
 *
 * @returns {Disposable} The command to open the output channel
 */
function setupErrorHandler() {
    statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, -1);
    statusBarItem.text = 'Sort Imports';
    statusBarItem.command = `${utils_1.EXTENSION_NAME}.open-output`;
    toggleStatusBarItem(vscode_1.window.activeTextEditor);
    // Setup the outputChannel
    outputChannel = vscode_1.window.createOutputChannel('Sort Imports');
    return vscode_1.commands.registerCommand(`${utils_1.EXTENSION_NAME}.open-output`, () => {
        outputChannel.show();
    });
}
exports.setupErrorHandler = setupErrorHandler;
//# sourceMappingURL=errorHandler.js.map