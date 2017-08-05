import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import { updateFlags, updateStatus } from './../ducks';

export default function createFlopFlipEnhancer(clientSideId, user) {
  const client = initialize({ clientSideId, user });

  return next => (...args) => {
    const store = next(...args);

    listen({
      client,
      onUpdateFlags: store.dispatch(updateFlags),
      onUpdateStatus: store.dispatch(updateStatus),
    });

    return store;
  };
}
