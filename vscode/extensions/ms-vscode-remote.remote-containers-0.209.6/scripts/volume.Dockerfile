FROM mcr.microsoft.com/vscode/devcontainers/base:0-alpine-3.14

RUN apk add --no-cache \
	nodejs \
	docker-cli \
	docker-compose \
	;
