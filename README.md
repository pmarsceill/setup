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
$ stow -t "$HOME" "git"
```
