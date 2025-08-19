#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "This script must be sourced instead of executed. Use: source ${BASH_SOURCE[0]}"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${0}")/.." && pwd)"

# Check if --secure flag is present in any argument
if [[ "$1" == "--secure" || "$2" == "--secure" ]]; then
  export DOCKER_CERT_PATH=$PROJECT_ROOT/node_modules/.alchemy-sandbox/dind/certs/client
  export DOCKER_TLS_VERIFY=1
  # If --secure is first arg, environment is second arg or default
  if [[ "$1" == "--secure" ]]; then
    export ENVIRONMENT=${2:-unauthenticated}
  else
    export ENVIRONMENT=${1:-unauthenticated}
  fi
else
  export ENVIRONMENT=${1:-unauthenticated}
  unset DOCKER_TLS_VERIFY
  unset DOCKER_CERT_PATH
fi

export DOCKER_CONFIG=$PROJECT_ROOT/node_modules/.alchemy-sandbox/context/$ENVIRONMENT
export DOCKER_HOST=tcp://localhost:12376

mkdir -p $DOCKER_CONFIG
mkdir -p $PROJECT_ROOT/node_modules/.alchemy-sandbox/selfhosted-registry/{auth,certs,data}