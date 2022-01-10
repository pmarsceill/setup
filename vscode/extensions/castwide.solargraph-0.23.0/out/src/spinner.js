'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Inspired by elegant-spinner (https://github.com/sindresorhus/elegant-spinner)
class Spinner {
    constructor() {
        // The original elegant-spinner used different characters on Windows due to
        // lack of Unicode support in the console. Since vscode-solargraph uses it
        // in the status bar, Unicode is fine.
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.interval = 0;
    }
    spin() {
        return this.frames[this.interval = ++this.interval % this.frames.length];
    }
}
exports.default = Spinner;
;
//# sourceMappingURL=Spinner.js.map