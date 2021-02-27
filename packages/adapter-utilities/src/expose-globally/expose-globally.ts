import type { TAdapter } from '@flopflip/types';
import getGlobalThis from 'globalthis';

const exposeGlobally = (adapter: TAdapter) => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__[adapter.id] = adapter;
};

export default exposeGlobally;
