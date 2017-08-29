# Dotfiles
My dotfiles (configuration files) for commonly used applications.

- Git
- ohmyzsh
- Neovim
- irssi
- iterm2
- zsh

![Terminal and Vim](https://user-images.githubusercontent.com/896475/29837734-03967d6a-8cc7-11e7-839c-f69fcdaabe67.png)

## On MacOS
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
$ stow -t "$HOME" "git"
```
