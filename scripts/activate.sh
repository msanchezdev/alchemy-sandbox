#!/bin/bash
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "This script must be sourced instead of executed. Use: source ${BASH_SOURCE[0]}"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export ENVIRONMENT=${1:-unauthenticated}

export DOCKER_CONFIG=$PROJECT_ROOT/node_modules/.alchemy-sandbox/context/$ENVIRONMENT
export DOCKER_HOST=tcp://localhost:12376

mkdir -p $DOCKER_CONFIG
mkdir -p $PROJECT_ROOT/node_modules/.alchemy-sandbox/selfhosted-registry/{auth,certs,data}