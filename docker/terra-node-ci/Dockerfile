# This dockerfile provides a docker image for terra projects to extend to use in CI it will copy code as well as run npm install by default.
FROM cerner/terra-node-base:latest

# Copy all the things
ONBUILD COPY . /opt/module

ONBUILD RUN npm install --loglevel error
