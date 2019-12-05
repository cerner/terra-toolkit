FROM cerner/terra-node-base:latest

#install zsh / oh-my-zsh
RUN apk add zsh curl wget git \
  && wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

ENV WDIO_BAIL false

CMD "/bin/zsh"
