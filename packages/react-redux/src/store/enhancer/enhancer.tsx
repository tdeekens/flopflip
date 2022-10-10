import {
  type TAdapter,
  type TAdapterArgs,
  type TAdapterInterface,
  type TAdapterStatusChange,
  type TFlagsChange,
} from '@flopflip/types';
import {
  type PreloadedState,
  type Reducer,
  type Store,
  type StoreEnhancerStoreCreator,
} from 'redux';

import { updateFlags, updateStatus } from '../../ducks';
import { type TState } from '../../types';

export default function createFlopFlipEnhancer(
  adapter: TAdapter,
  adapterArgs: TAdapterArgs
): <StoreState extends TState>(
  next: StoreEnhancerStoreCreator<StoreState>
) => (
  reducer: Reducer<StoreState>,
  preloadedState?: PreloadedState<StoreState>
) => Store {
  return (next) =>
    (...args) => {
      const store: Store = next(...args);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (adapter as TAdapterInterface<TAdapterArgs>).configure(adapterArgs, {
        // NOTE: This is like `bindActionCreators` but the bound action
        // creators are renamed to fit the adapter API and conventions.
        onFlagsStateChange(flagsChange: TFlagsChange) {
          store.dispatch(updateFlags(flagsChange, [adapter.id]));
        },
        onStatusStateChange(statusChange: TAdapterStatusChange) {
          store.dispatch(updateStatus(statusChange));
        },
      });

      return store;
    };
}
