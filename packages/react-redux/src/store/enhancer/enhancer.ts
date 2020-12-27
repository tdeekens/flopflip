import type {
  Store,
  StoreEnhancerStoreCreator,
  Reducer,
  PreloadedState,
} from 'redux';
import type {
  TAdapter,
  TAdapterArgs,
  TAdapterStatusChange,
  TFlagsChange,
  TAdapterInterface,
} from '@flopflip/types';
import type { TState } from '../../types';

import { updateFlags, updateStatus } from '../../ducks';

export default function createFlopFlipEnhancer(
  adapter: TAdapter,
  adapterArgs: TAdapterArgs
): <StoreState extends TState>(
  next: StoreEnhancerStoreCreator<StoreState>
) => (
  reducer: Reducer<StoreState>,
  preloadedState?: PreloadedState<StoreState>
) => Store {
  return (next) => (...args) => {
    const store: Store = next(...args);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (adapter as TAdapterInterface<TAdapterArgs>).configure(adapterArgs, {
      // NOTE: This is like `bindActionCreators` but the bound action
      // creators are renamed to fit the adapter API and conventions.
      onFlagsStateChange: (flagsChange: TFlagsChange) => {
        store.dispatch(updateFlags(flagsChange));
      },
      onStatusStateChange: (statusChange: TAdapterStatusChange) => {
        store.dispatch(updateStatus(statusChange));
      },
    });

    return store;
  };
}
