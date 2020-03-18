module.exports = {
  displayName: 'test',
  preset: 'ts-jest/presets/js-with-babel',
  // Without this option, somehow CI fails to run the tests with the following error:
  //   TypeError: Unable to require `.d.ts` file.
  //   This is usually the result of a faulty configuration or import. Make sure there is a `.js`, `.json` or another executable extension available alongside `core.ts`.
  // Fix is based on this comment:
  // - https://github.com/kulshekhar/ts-jest/issues/805#issuecomment-456055213
  // - https://github.com/kulshekhar/ts-jest/blob/master/docs/user/config/isolatedModules.md
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFiles: [
    'raf/polyfill',
    'jest-localstorage-mock',
    './throwing-console-patch.js',
  ],
  setupFilesAfterEnv: ['./jest-runner-test.config.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testURL: 'http://localhost',
  watchPlugins: ['jest-plugin-filename', 'jest-watch-yarn-workspaces'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/.*/node_modules',
    '/packages/.*/dist',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
