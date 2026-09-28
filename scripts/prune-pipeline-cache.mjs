#!/usr/bin/env node

// Keeps only the `pnpm pipeline` cache entries used by the runs of this job.
//
// pnpm does not evict task cache entries. Restoring the cache in CI and saving
// it again would otherwise grow it with every run. Each run records the cache
// key of every task it started in `runs/<id>/events.ndjson`, so any entry not
// named there is stale for the current commit.

import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const cacheDir = join(
  process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'),
  'pnpm',
  'pipeline',
);

if (!existsSync(cacheDir)) {
  console.log(`::warning::No pipeline cache found at ${cacheDir}`);
  process.exit(0);
}

const listDirs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

for (const workspace of listDirs(cacheDir)) {
  const workspaceDir = join(cacheDir, workspace);
  const runsDir = join(workspaceDir, 'runs');
  const tasksDir = join(workspaceDir, 'tasks');

  const usedKeys = new Set();
  for (const run of listDirs(runsDir)) {
    const eventsFile = join(runsDir, run, 'events.ndjson');
    if (!existsSync(eventsFile)) {
      continue;
    }
    for (const line of readFileSync(eventsFile, 'utf8').split('\n')) {
      if (!line) {
        continue;
      }
      const event = JSON.parse(line);
      if (event.key) {
        usedKeys.add(event.key);
      }
    }
  }

  // Without a run there is nothing to tell stale entries from live ones.
  if (usedKeys.size === 0) {
    console.log(`Skipping ${workspace}: no pipeline runs recorded`);
    continue;
  }

  let kept = 0;
  let removed = 0;
  for (const prefix of listDirs(tasksDir)) {
    const prefixDir = join(tasksDir, prefix);
    for (const key of listDirs(prefixDir)) {
      if (usedKeys.has(key)) {
        kept += 1;
      } else {
        rmSync(join(prefixDir, key), { recursive: true, force: true });
        removed += 1;
      }
    }
    if (listDirs(prefixDir).length === 0) {
      rmSync(prefixDir, { recursive: true, force: true });
    }
  }

  // Run reports are only diagnostics and are not needed for cache hits.
  rmSync(runsDir, { recursive: true, force: true });

  console.log(`Pruned ${workspace}: kept ${kept}, removed ${removed} entries`);
}
