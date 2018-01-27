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
      /**
       * NOTE: This is like `bindActionCreators` but the bound action
       * creators are renamed to fit the adapter API and conventions.
       */
      onFlagsStateChange: (...args) => store.dispatch(updateFlags(...args)),
      onStatusStateChange: (...args) => store.dispatch(updateStatus(...args)),
    });

    return store;
  };
}
