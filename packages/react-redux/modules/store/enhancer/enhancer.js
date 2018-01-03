// @flow

import type { Store } from 'redux';
import type { Adapter, AdapterArgs } from '@flopflip/types';
import type { State } from '../../types';

import { updateFlags, updateStatus } from '../../ducks';

export default function createFlopFlipEnhancer(
  adapter: Adapter,
  adapterArgs: AdapterArgs
): Function => Store {
  return (next: mixed => Store) => (...args) => {
    const store: Store = next(...args);

    adapter.configure({
      ...adapterArgs,
      onUpdateFlags: store.dispatch(updateFlags),
      onUpdateStatus: store.dispatch(updateStatus),
    });

    return store;
  };
}
