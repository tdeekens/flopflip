import { updateFlags, updateStatus } from '../../ducks';

export default function createFlopFlipEnhancer(adapter, adapterArgs) {
  return next => (...args) => {
    const store = next(...args);

    adapter.configure({
      ...adapterArgs,
      onUpdateFlags: store.dispatch(updateFlags),
      onUpdateStatus: store.dispatch(updateStatus),
    });

    return store;
  };
}
