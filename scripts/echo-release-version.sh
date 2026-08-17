#!/usr/bin/env bash

set -euo pipefail

release_plan=$(mktemp)
trap 'rm -f "$release_plan"' EXIT

echo "Running 'changeset status' to know the next release version"

pnpm changeset status --output="$release_plan"

# All @flopflip/* packages release in lockstep through the "fixed" group in
# .changeset/config.json, so any one of them carries the release version. With no
# pending changesets the release plan is empty and the version already on disk is
# the one the release will carry.
release_version=$(node -e '
  const { readFileSync } = require("node:fs");

  const plan = JSON.parse(readFileSync(process.argv[1], "utf8"));
  const release = plan.releases.find(({ name }) => name === "@flopflip/react");

  console.log(release?.newVersion ?? require("./packages/react/package.json").version);
' "$release_plan")

echo "Version for release is $release_version"

echo "VERSION=$release_version" >>"$GITHUB_OUTPUT"
