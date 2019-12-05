# This dockerfile provides a docker image setup with zshell for developers to use as a common node development environment.
# This image copies no code in and can be used directly with a volume mount to add code to the /opt/module directory.
FROM cerner/terra-node-base:latest

#install zsh / oh-my-zsh
RUN apk add zsh curl wget git \
  && wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

ENV WDIO_BAIL false

CMD "/bin/zsh"
