#!/bin/bash

# Inherit the REMOTE_HOST attribute from Marathon ENV Variables
if [ ! -z "$HOST" ] && [ ! -z "$PORT" ]; then
  export REMOTE_HOST="http://$HOST:$PORT"
fi

# Call the original Entrypoint
source /opt/bin/entry_point.sh
