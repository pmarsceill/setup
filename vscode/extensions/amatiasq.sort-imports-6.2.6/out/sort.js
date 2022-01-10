"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWithoutSorting = exports.sortCurrentDocument = exports.sort = exports.skipFileSorting = void 0;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const code_frame_1 = require("@babel/code-frame");
const config_cache_1 = require("./config-cache");
const import_sort_1 = require("import-sort");
const on_save_1 = require("./on-save");
const errorHandler_1 = require("./errorHandler");
const defaultLanguages = ['javascript', 'typescript'];
const skipFileSorting = (fileName) => {
    const skipTypeDefs = utils_1.getConfiguration('ignore-type-defs');
    return skipTypeDefs && fileName.endsWith('.d.ts');
};
exports.skipFileSorting = skipFileSorting;
function sort(document) {
    const languages = utils_1.getConfiguration('languages') || defaultLanguages;
    const isValidLanguage = languages.some((language) => document.languageId.includes(language));
    if (!isValidLanguage) {
        return;
    }
    const currentText = document.getText();
    const fileName = document.fileName;
    if (exports.skipFileSorting(fileName)) {
        return;
    }
    return errorHandler_1.safeExecution(() => {
        const { parser, style, config: { options }, } = config_cache_1.getConfig(document);
        try {
            const result = import_sort_1.default(currentText, parser, style, fileName, options);
            return result.code;
        }
        catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const error = err;
            error.message =
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                error.message +
                    '\n\n' +
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    code_frame_1.codeFrameColumns(currentText, { start: err.loc });
            throw err;
        }
    }, null, fileName);
}
exports.sort = sort;
function sortCurrentDocument() {
    const { activeTextEditor: editor, activeTextEditor: { document }, } = vscode_1.window;
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }
    return editor.edit((edit) => edit.replace(utils_1.getMaxRange(), sortedText));
}
exports.sortCurrentDocument = sortCurrentDocument;
async function saveWithoutSorting() {
    const { document } = vscode_1.window.activeTextEditor;
    await on_save_1.default.bypass(async () => await document.save());
}
exports.saveWithoutSorting = saveWithoutSorting;
//# sourceMappingURL=sort.js.map