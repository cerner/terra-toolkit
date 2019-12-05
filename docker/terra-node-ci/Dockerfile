FROM cerner/terra-node-base

# Copy all the things
ONBUILD COPY . /opt/module

ONBUILD RUN npm install --loglevel error
