# This dockerfile serves as a base for our CI and Dev docker containers. It provides a common version of node as well as some other common settings.

FROM node:dubnium-alpine

EXPOSE 8080

ENV CI true

RUN npm config set unsafe-perm true -g \
  && apk add git

WORKDIR /opt/module
