#!/bin/bash

brew install stow

# symlink all dot files

stow -t "$HOME/.oh-my-zsh" "oh-my-zsh" --ignore '.*\DS_Store'
stow -t "$HOME/.config" "config" --ignore '.*\DS_Store'

stow -t "$HOME" "alfred" --ignore '.*\DS_Store'
stow -t "$HOME" "bash" --ignore '.*\DS_Store'
stow -t "$HOME" "desktop-bg" --ignore '.*\DS_Store'
stow -t "$HOME" "git" --ignore '.*\DS_Store'
stow -t "$HOME" "irc" --ignore '.*\DS_Store'
stow -t "$HOME" "iterm" --ignore '.*\DS_Store'
stow -t "$HOME" "vim" --ignore '.*\DS_Store'
stow -t "$HOME" "zsh" --ignore '.*\DS_Store'
