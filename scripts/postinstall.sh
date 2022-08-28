#!/usr/bin/env bash

set -e

if [ -n "$SKIP_POSTINSTALL_DEV_SETUP" ]; then
  echo "Skipping development setup."
elif [[ $NPM_CONFIG_CACHE =~ "renovate" ]]; then
  echo "Renovate update detected, skipping post install."
else
  echo "Preparing development setup."
  yarn setup
fi

echo "Running prettier on package.json files"
# We need to run prettier to avoid unnecessary formatting changes to package.json (due to Yarn install).
yarn prettier --write --parser json '**/package.json' &>/dev/null
