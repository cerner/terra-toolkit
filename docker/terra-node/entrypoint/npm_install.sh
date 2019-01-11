#/bin/sh -e
# check if the mode modules folder exists and is populated.
if [ -n "$(ls -A node_modules 2>/dev/null)" ]
then
  echo "node_modules installed"
else
  npm install
fi