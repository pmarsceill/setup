#!/bin/bash

brew install stow

# symlink all dot files

$ stow -t "$HOME" "alfred"
$ stow -t "$HOME" "bash"
$ stow -t "$HOME" "desktop-bg"
$ stow -t "$HOME" "git"
$ stow -t "$HOME" "irc"
$ stow -t "$HOME" "iterm"
$ stow -t "$HOME" "vim"
$ stow -t "$HOME" "zsh"
