#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <username> <password>"
  echo "Example: $0 testuser testpassword"
  exit 1
fi

mkdir -p ./node_modules/.alchemy-sandbox/selfhosted-registry/auth
docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn $1 $2 > ./node_modules/.alchemy-sandbox/selfhosted-registry/auth/htpasswd