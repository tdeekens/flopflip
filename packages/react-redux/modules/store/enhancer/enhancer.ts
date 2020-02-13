import {
  Store,
  StoreEnhancerStoreCreator,
  Reducer,
  PreloadedState,
} from 'redux';
import {
  TAdapter,
  TAdapterArgs,
  TAdapterStatusChange,
  TFlagsChange,
  TAdapterInterface,
} from '@flopflip/types';
import { TState } from '../../types';
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
  return next => (...args) => {
    const store: Store = next(...args);

    (adapter as TAdapterInterface<TAdapterArgs>).configure(adapterArgs, {
      // NOTE: This is like `bindActionCreators` but the bound action
      // creators are renamed to fit the adapter API and conventions.
      onFlagsStateChange: (flags: TFlagsChange) => {
        store.dispatch(updateFlags(flags));
      },
      onStatusStateChange: (status: TAdapterStatusChange) => {
        store.dispatch(updateStatus(status));
      },
    });

    return store;
  };
}
