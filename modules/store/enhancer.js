import { initialize, listen } from './../utils/ld-wrapper';
import { updateFlags, updateStatus } from './../ducks';

export default function createFlopFlipEnhancer(clientSideId, user) {
  const client = initialize({ clientSideId, user });

  return next => (...args) => {
    const store = next(...args);

    listen({
      client,
      updateFlags: store.dispatch(updateFlags),
      updateStatus: store.dispatch(updateStatus),
    });

    return store;
  };
}
