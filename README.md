# Dotfiles
My dotfiles (configuration files) for commonly used applications and MacOS settings

## New system prep

### Install dev tools
- Download and [install latest version of Xcode from the Mac App Store](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiw47aH6JXWAhUhjlQKHSRnBEIQFggoMAA&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fxcode%2Fid497799835%3Fmt%3D12&usg=AFQjCNGrxKmVtXUdvUU3MhqZhP4MHT6Gtg).
- Download and install Xcode Command Line Tools from https://developer.apple.com/downloads/.

Install Homebrew 
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install [Git](https://downloads.sourceforge.net/project/git-osx-installer/git-2.14.1-intel-universal-mavericks.dmg?r=https%3A%2F%2Fgit-scm.com%2Fdownload%2Fmac&ts=1504882896&use_mirror=astuteinternet)

Install Hub
```
brew install hub
```

Install zsh
```
brew install zsh zsh-completions
``` 

Make zsh default shell
```
chsh -s $(which zsh)
```

Install ohmyzsh
```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Install nodenv
```
brew install nodenv
```

Install NeoVim
```
brew install neovim
```

Install Plug
```
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

#### nvim and zshell in iterm2

![Terminal and Vim](https://user-images.githubusercontent.com/896475/29837734-03967d6a-8cc7-11e7-839c-f69fcdaabe67.png)

### Install other utilities
- Download and [install 1Password from Mac App Store](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwjH99Oa55XWAhWIy4MKHe8ACAEQFggoMAA&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2F1password-password-manager-and-secure-wallet%2Fid443987910%3Fmt%3D12&usg=AFQjCNGgeT9WzxbM-7n-SRIrRwgvQe8krQ)
- Download and [install Alfred](https://cachefly.alfredapp.com/Alfred_3.4.1_860.dmg)
- Download and [install Aware from Mac App Store](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiOkIfD55XWAhXFpYMKHQ6QCV4QFggoMAA&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Faware%2Fid1082170746%3Fmt%3D12&usg=AFQjCNGi5u90a5faPxTgk1PyiDMXZuWBfw)
- Download and [install Dropbox](https://www.dropbox.com/download?os=mac)

## Install these dotfiles on MacOS
```
$ git clone https://github.com/pmarsceill/dotfiles ~/.dotfiles
```

Install GNU stow (optional)
```
$ brew install stow
```

Use Stow to create symlinks for each directory to `$HOME` (or do it yourself manually)
```
$ cd ~/.dotfiles
$ stow -t "$HOME" "alfred"
$ stow -t "$HOME" "bash"
$ stow -t "$HOME" "desktop-bg"
$ stow -t "$HOME" "git"
$ stow -t "$HOME" "irc"
$ stow -t "$HOME" "iterm"
$ stow -t "$HOME" "vim"
$ stow -t "$HOME" "zsh"
```

## Set OS prefs

### Set desktop bg
`osascript -e 'tell application “Finder” to set desktop picture to POSIX file "~/.desktop.jpg"'`

### Make darkmode the default
`sudo defaults write /Library/Preferences/.GlobalPreferences.plist _HIEnableThemeSwitchHotKey -bool true`

## To do
- [ ] Automatically symlink all the directories with one command
- [ ] Add a setup script that installs application dependencies (like `brew install hub`, etc...)
