// This file exists  because we want jest to use our non-compiled code to run tests
// if this file is missing, and you have a `module` or `main` that points to a non-existing file
// (ie, a bundle that hasn't been built yet) then jest will fail if the bundle is not yet built.
// all apps should export all their named exports from their root index.js
export * from './src';
