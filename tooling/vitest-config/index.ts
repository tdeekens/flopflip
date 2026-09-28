import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  test: {
    globals: true,
    // The default from vitest 5 on. Set explicitly so tests cannot rely on
    // mock calls leaking in from earlier tests.
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('setup-tests.ts', import.meta.url))],
  },
});
