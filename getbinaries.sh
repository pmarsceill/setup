#!/bin/bash

# Install Mas
brew install mas

# Install XCode
mas install 497799835
sudo xcodebuild -license accept

# Install gh command line
brew install gh

# Install zsh
brew install zsh zsh-completions

# Make zsh default shell
chsh -s $(which zsh)

# Install ohmyszsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install nodenv
brew install nodenv

# Install NeoVim
brew install neovim

# Install Plug
git clone https://github.com/k-takata/minpac.git ~/.config/nvim/pack/minpac/opt/minpac

# Install 1Password
mas install 1333542190

# Install Aware
mas install 1082170746
