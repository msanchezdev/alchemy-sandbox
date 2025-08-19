#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "This script must be sourced instead of executed. Use: source ${BASH_SOURCE[0]}"
  exit 1
fi

unset DOCKER_CERT_PATH
unset DOCKER_TLS_VERIFY
unset ENVIRONMENT
unset DOCKER_CONFIG
unset DOCKER_HOST