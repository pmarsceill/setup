"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruby_spawn_1 = require("ruby-spawn");
function checkRubyVersion() {
    return new Promise((resolve, reject) => {
        var child = ruby_spawn_1.rubySpawn('ruby', ['-v']);
        var output = '';
        var pending = true;
        child.stdout.on('data', (buffer) => {
            output += buffer.toString();
        });
        child.on('error', (err) => {
            if (pending) {
                reject(err);
                pending = false;
            }
        });
        child.on('exit', (code) => {
            if (pending) {
                if (code == 0) {
                    resolve(output);
                }
                else {
                    reject(`exit code ${code}`);
                }
                pending = false;
            }
        });
    });
}
exports.checkRubyVersion = checkRubyVersion;
//# sourceMappingURL=checkRubyVersion.js.map