#/bin/sh -e
# check if the mode modules folder exists and is populated.
if [ -n "$(ls -A node_modules 2>/dev/null)" ]
then
  echo "Local node_modules exists. Copying local node_modules to docker container."
else
  npm install
fi