"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const child_process = require("child_process");
function solargraphCommand(args) {
    let cmd = [];
    if (vscode.workspace.getConfiguration('solargraph').useBundler) {
        // TODO: pathToBundler configuration
        cmd.push('bundle', 'exec', 'solargraph');
    }
    else {
        cmd.push(vscode.workspace.getConfiguration('solargraph').commandPath);
    }
    var env = { shell: true };
    if (vscode.workspace.rootPath)
        env['cwd'] = vscode.workspace.rootPath;
    return child_process.spawn(cmd.shift(), cmd.concat(args), env);
}
exports.solargraphCommand = solargraphCommand;
function yardCommand(args) {
    let cmd = [];
    if (vscode.workspace.getConfiguration('solargraph').useBundler) {
        cmd.push('bundle', 'exec');
    }
    cmd.push('yard');
    var env = { shell: true };
    if (vscode.workspace.rootPath)
        env['cwd'] = vscode.workspace.rootPath;
    return child_process.spawn(cmd.shift(), cmd.concat(args), env);
}
exports.yardCommand = yardCommand;
function gemCommand(args) {
    let cmd = [];
    if (vscode.workspace.getConfiguration('solargraph').useBundler) {
        cmd.push('bundle', 'exec');
    }
    cmd.push('gem');
    var env = { shell: true };
    if (vscode.workspace.rootPath)
        env['cwd'] = vscode.workspace.rootPath;
    return child_process.spawn(cmd.shift(), cmd.concat(args), env);
}
exports.gemCommand = gemCommand;
//# sourceMappingURL=commands.js.map