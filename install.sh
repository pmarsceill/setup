#!/bin/bash

brew install stow

# symlink all dot files

stow -t "$HOME/.vscode" "vscode" --ignore '.*\DS_Store'
stow -t "$HOME/.oh-my-zsh" "oh-my-zsh" --ignore '.*\DS_Store'
stow -t "$HOME" "avatar" --ignore '.*\DS_Store'
stow -t "$HOME" "bash" --ignore '.*\DS_Store'
stow -t "$HOME" "desktop-bg" --ignore '.*\DS_Store'
stow -t "$HOME" "git" --ignore '.*\DS_Store'
stow -t "$HOME" "gpg" --ignore '.*\DS_Store'
stow -t "$HOME" "irc" --ignore '.*\DS_Store'
stow -t "$HOME" "iterm" --ignore '.*\DS_Store'
stow -t "$HOME" "ssh" --ignore '.*\DS_Store'
stow -t "$HOME" "zsh" --ignore '.*\DS_Store'
