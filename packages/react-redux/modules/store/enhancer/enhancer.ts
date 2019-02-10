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
): <StoreState extends State>(
  next: StoreEnhancerStoreCreator<StoreState>
) => (
  reducer: Reducer<StoreState, AnyAction>,
  preloadedState?: DeepPartial<StoreState>
) => Store {
  return next => (...args) => {
    const store: Store = next(...args);

    adapter.configure({
      ...adapterArgs,
      // NOTE: This is like `bindActionCreators` but the bound action
      // creators are renamed to fit the adapter API and conventions.
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
