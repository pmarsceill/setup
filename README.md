# Dotfiles

My dotfiles (configuration files) for commonly used applications and MacOS settings.

## New system prep

### Get Git & Homebrew to clone this repo and install binaries

#### Install XCode command line tools

```
$ xcode-select --install
```

#### Install Homebrew

```
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

#### Install Git

```
$ brew install git
```

#### Clone this repo

```
$ git clone https://github.com/pmarsceill/dotfiles ~/dotfiles
$ cd ~/dotfiles
```

### Install the rest of the binaries

```
$ ./getbinaries.sh
```

### Install other utilities

- Download and [install Karibiner Elements](https://karabiner-elements.pqrs.org)

## Install dotfiles

```
$ ./install.sh
```
