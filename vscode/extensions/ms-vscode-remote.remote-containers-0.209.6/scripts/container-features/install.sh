#!/bin/sh
set -e

# The Dockerfile will run this `install.sh` script after cd'ing to the directory where this script exists 
# AKA to the root folder of this features "package"

set -a
. ./features.env
set +a

if [ "$_BUILD_ARG_GITHUB_INSTALL" = "true" ]
then
	bash ./github-debian.sh
fi

if [ "$_BUILD_ARG_DOCKER_IN_DOCKER_INSTALL" = "true" ]
then
	bash ./docker-in-docker-debian.sh
fi

if [ ! -z "$_BUILD_ARG_NODEJS_VERSION" ]
then
	bash ./node-debian.sh /usr/local/share/nvm "$_BUILD_ARG_NODEJS_VERSION"
fi

if [ ! -z "$_BUILD_ARG_GIT_VERSION" ]
then
	bash ./git-from-source-debian.sh "$_BUILD_ARG_GIT_VERSION" "${_BUILD_ARG_GIT_PPA:-"true"}"
fi
