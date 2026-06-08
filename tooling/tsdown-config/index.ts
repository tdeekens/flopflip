import { defineConfig } from 'tsdown';

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
});
