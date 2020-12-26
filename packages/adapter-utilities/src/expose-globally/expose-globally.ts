import type { TAdapter, TFlagsUpdateFunction } from '@flopflip/types';

import getGlobalThis from 'globalthis';

const exposeGlobally = (
  adapter: TAdapter,
  updateFlags: TFlagsUpdateFunction
) => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__[adapter.id] = {
    adapter,
    updateFlags,
  };
};

export default exposeGlobally;
