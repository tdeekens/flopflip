#!/usr/bin/env bash

set -euo pipefail

: "${VERSION:?VERSION must be set}"
: "${PUBLISHED_PACKAGES:?PUBLISHED_PACKAGES must be set}"

release_notes=$(mktemp)
trap 'rm -f "$release_notes"' EXIT

echo "Assembling release notes for v$VERSION"

# All @flopflip/* packages release in lockstep through the "fixed" group in
# .changeset/config.json, so one GitHub release per version carries the changelog
# entries of every package published in this run. changesets/action only knows how
# to create one release per package, hence we assemble the aggregate body here.
node -e '
  const { readdirSync, readFileSync } = require("node:fs");
  const { join } = require("node:path");

  const version = process.env.VERSION;
  const publishedPackages = JSON.parse(process.env.PUBLISHED_PACKAGES);

  const packageDirsByName = new Map();

  for (const workspaceDir of ["packages", "tooling"]) {
    for (const entry of readdirSync(workspaceDir)) {
      const dir = join(workspaceDir, entry);

      try {
        const { name } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));

        packageDirsByName.set(name, dir);
      } catch {
        // not a package directory
      }
    }
  }

  const readChangelogEntry = (dir, version) => {
    const lines = readFileSync(join(dir, "CHANGELOG.md"), "utf8").split("\n");
    const start = lines.findIndex((line) => line.trim() === `## ${version}`);

    if (start === -1) return undefined;

    const rest = lines.slice(start + 1);
    const end = rest.findIndex((line) => line.startsWith("## "));

    return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
  };

  const sections = [...publishedPackages]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, version }) => {
      const dir = packageDirsByName.get(name);
      const entry = dir === undefined ? undefined : readChangelogEntry(dir, version);

      if (entry === undefined) {
        console.error(`No changelog entry found for ${name}@${version}`);
      }

      return `## ${name}@${version}\n\n${entry ?? "_No changelog entry found._"}`;
    });

  if (sections.length === 0) {
    throw new Error("No published packages to create a release for");
  }

  console.log(sections.join("\n\n"));
' >"$release_notes"

if gh release view "v$VERSION" >/dev/null 2>&1; then
  echo "Release v$VERSION already exists, updating its notes"

  gh release edit "v$VERSION" --notes-file "$release_notes"

  exit 0
fi

release_flags=(
  --title "v$VERSION"
  --notes-file "$release_notes"
  --target "$GITHUB_SHA"
)

if [[ "$VERSION" == *-* ]]; then
  release_flags+=(--prerelease)
fi

gh release create "v$VERSION" "${release_flags[@]}"
