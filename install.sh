#!/bin/bash

BASEDIR="$(cd "$dirname "${BASH_SOURCE[0]}")" && pwd)"

# symlink all dot files

ln -s ${BASEDIR}/vim/* ~/
ln -s ${BASEDIR}/alfred/* ~/
ln -s ${BASEDIR}/bash/* ~/
ln -s ${BASEDIR}/desktop-bg/* ~/
ln -s ${BASEDIR}/git/* ~/
ln -s ${BASEDIR}/irc/* ~/
ln -s ${BASEDIR}/iterm/* ~/
ln -s ${BASEDIR}/vim/* ~/
ln -s ${BASEDIR}/zsh/* ~/
