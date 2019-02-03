import {
  Store,
  StoreEnhancerStoreCreator,
  Reducer,
  DeepPartial,
  AnyAction,
} from 'redux';
import { Adapter, AdapterArgs, AdapterStatus, Flags } from '@flopflip/types';
import { State } from '../../types';

import { updateFlags, updateStatus } from '../../ducks';

export default function createFlopFlipEnhancer(
  adapter: Adapter,
  adapterArgs: AdapterArgs
): <S extends State>(
  next: StoreEnhancerStoreCreator<S>
) => (
  reducer: Reducer<S, AnyAction>,
  preloadedState?: DeepPartial<S>
) => Store {
  return next => (...args) => {
    const store: Store = next(...args);

    adapter.configure({
      ...adapterArgs,
      /**
       * NOTE: This is like `bindActionCreators` but the bound action
       * creators are renamed to fit the adapter API and conventions.
       */
      onFlagsStateChange: (flags: Flags) => {
        store.dispatch(updateFlags(flags));
      },
      onStatusStateChange: (status: AdapterStatus) => {
        store.dispatch(updateStatus(status));
      },
    });

    return store;
  };
}
