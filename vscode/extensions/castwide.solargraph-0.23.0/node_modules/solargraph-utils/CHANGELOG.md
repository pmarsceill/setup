## 1.1.0 - November 17, 2019
- Updated ruby-spawn (improved rvm/rbenv support)

## 1.0.1 - July 4, 2019
- Use explicit `cd` for bash and zsh shells to work with rvm/rbenv

## 0.8.2 - December 24, 2018
- Fixed solargraph command generation

## 0.8.1 - December 23, 2018
- Solargraph commands are sent to bash/zsh as a single argument.
- SocketProvider tests

## 0.8.0 - November 29, 2018
- Custom solargraph command paths do not play shell games.
- Bash shells use login shells (-l).
- Zsh shells use interactive shells (-i).

## 0.7.4 - August 18, 2018
- Removed unused dependencies.

## 0.7.3 - May 17, 2018
- Report errors finding the solargraph executable.

## 0.7.2 - April 15, 2018
- Spawn only uses explicit login with bash and zsh shells.

## 0.7.1 - April 5, 2018
- Capture ENOENT error when verifying gem installation

## 0.7.0 - April 3, 2018
- First version of language server

## 0.6.0 - March 6, 2018
- bundlerPath configuration

## 0.5.1 - February 2, 2018
- Commands use process.env.SHELL when available

## 0.5.0 - February 1, 2018
- Server.define() method

## 0.4.1 - January 31, 2018
- Escape shell command arguments
- Invoke explicit bash shell on darwin and linux

## 0.4.0 - January 15, 2018
- Capture errors in HTTP response codes
- Path resolution bug
- Processes use /bin/bash on darwin and linux
- Export commands
