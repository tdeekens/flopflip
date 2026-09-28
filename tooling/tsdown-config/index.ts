import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig } from 'tsdown';

const VERSION_PLACEHOLDER = '__@FLOPFLIP/VERSION_OF_RELEASE__';

// Packages export `version` as a placeholder, replaced here with the version
// of the package being built. tsdown runs in the package directory.
const { version: packageVersion } = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
) as { version: string };

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  target: 'es2015',
  clean: true,
  // Drive extensions from package.json `type: module`: ESM -> .js, CJS -> .cjs
  // (and .d.ts / .d.cts). tsdown defaults this to true for platform 'node',
  // which would emit .mjs / .d.mts and break the `exports` + bundlewatch paths.
  fixedExtension: false,
  plugins: [
    {
      name: 'flopflip:package-version',
      transform: {
        filter: { code: VERSION_PLACEHOLDER },
        handler(code) {
          return {
            code: code.replaceAll(VERSION_PLACEHOLDER, packageVersion),
            // The placeholder ends its line, so no mapped column moves.
            map: null,
          };
        },
      },
    },
  ],
});
