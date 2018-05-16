# use node as base image
FROM node:8.9.2

# Prepare Directory for Source Code
ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Mount Source into Container
ONBUILD ADD . /app

# expose the port
EXPOSE 8080

ONBUILD RUN npm config set unsafe-perm true
ONBUILD RUN npm install --silent
