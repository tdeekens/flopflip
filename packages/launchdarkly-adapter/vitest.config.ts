import configShared from '@flopflip/vitest-config';
import { defineProject, mergeConfig } from 'vitest/config';

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'jsdom',
    },
  }),
);
