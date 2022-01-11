#!/bin/bash

# Install Mas
brew install mas

# Install XCode
mas install 497799835
sudo xcodebuild -license accept

# Install iTerm2
brew install --cask iterm2

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

# Install gpg
brew install gnupg gnupg2

# Install VSCode 
brew install --cask visual-studio-code

# Install 1Password
brew install --cask 1password

# Install Raycast
brew install --cask raycast

# Install Slack
brew install --cask slack
