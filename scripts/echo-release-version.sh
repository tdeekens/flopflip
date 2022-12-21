#!/usr/bin/env bash

set -e

echo "Running 'changeset version' to know the new release version"

yarn changeset version &>/dev/null

echo "Running 'git status' to see the worktree changes"

git status

echo "Determining the version from the package.json of a package"
release_version=$(node -e "console.log(require('./packages/react/package.json').version)")

echo "Version for release is $release_version"

echo "Running 'git reset' and exporting to GITHUB_OUTPUT"

git reset --hard &>/dev/null

echo "VERSION=$release_version" >> $GITHUB_OUTPUT

echo "GITHUB_OUTPUT is:"
echo $GITHUB_OUTPUT

