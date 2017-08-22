# Dotfiles
My dotfiles (configuration files) for commonly used applications.


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
$ stow -t "$HOME" "bash"
$ stow -t "$HOME" "git"
$ stow -t "$HOME" "irc"
$ stow -t "$HOME" "git"
$ stow -t "$HOME" "iterm"
$ stow -t "$HOME" "vim"
$ stow -t "$HOME" "zsh"
```

## To do
- [ ] Automatically symlink all the directories with one command
- [ ] Add a setup script that installs application dependencies (like `brew install hub`, etc...)
