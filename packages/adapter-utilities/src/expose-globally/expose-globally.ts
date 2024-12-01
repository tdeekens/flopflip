import type { TAdapter } from '@flopflip/types';
import getGlobalThis from 'globalthis';

const exposeGlobally = (adapter: TAdapter) => {
  const global = getGlobalThis();

  global.__flopflip__ ||= {};

  global.__flopflip__[adapter.id] = adapter;
};

export { exposeGlobally };
