import {
  type TAdapter,
  type TAdapterArgs,
  type TAdapterInterface,
  type TAdapterStatusChange,
  type TFlagsChange,
  adapterIdentifiers as allAdapterIdentifiers,
} from '@flopflip/types';
import { createAction } from '@reduxjs/toolkit';
import type { Reducer, Store, StoreEnhancerStoreCreator } from 'redux';

import { updateFlags, updateStatus } from './ducks';
import type { TState } from './types';

// Create typed actions
const configureAdapter = createAction<{
  adapter: TAdapter;
  adapterArgs: TAdapterArgs;
}>('flopflip/configureAdapter');

function createFlopFlipEnhancer(
  adapter: TAdapter,
  adapterArgs: TAdapterArgs
): <StoreState extends TState>(
  next: StoreEnhancerStoreCreator<StoreState>
) => (reducer: Reducer<StoreState>, preloadedState?: StoreState) => Store {
  return (next) =>
    (...args) => {
      const store: Store = next(...args);

      // Dispatch configuration action
      store.dispatch(configureAdapter({ adapter, adapterArgs }));

      // Configure adapter with bound action creators
      (adapter as TAdapterInterface<TAdapterArgs>).configure(adapterArgs, {
        onFlagsStateChange: (flagsChange: TFlagsChange) => {
          store.dispatch(updateFlags(flagsChange, [adapter.id]));
        },
        onStatusStateChange: (statusChange: TAdapterStatusChange) => {
          store.dispatch(
            updateStatus(statusChange, Object.keys(allAdapterIdentifiers))
          );
        },
      });

      return store;
    };
}

export { createFlopFlipEnhancer };
