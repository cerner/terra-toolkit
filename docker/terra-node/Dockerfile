FROM node:8

EXPOSE 8080

COPY ./entrypoint /opt/entrypoint

RUN npm config set unsafe-perm true -g

#install zsh / oh-my-zsh
RUN apt-get update \
  && apt-get install -y zsh \
  && apt-get clean \
  && wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

# Do not set a default here or the building docker file will not be able to override the variable
ONBUILD ARG project_name
ONBUILD ARG npm_install

# Copy all the things
ONBUILD COPY . /opt/${project_name:-module}

ONBUILD WORKDIR /opt/${project_name:-module}

ONBUILD RUN if [ ${npm_install:-true} = "true" ]; then npm install --loglevel error ; else echo "Skipping npm install"; fi

CMD ["sh", "/opt/entrypoint/start.sh"]
