import { initialize, listen } from './../utils/ld-wrapper';

export default function createFlopFlipEnhancer(clientSideId, user) {
  const client = initialize({ clientSideId, user });

  return next => (...args) => {
    const store = next(...args);

    listen({ client, dispatch: store.dispatch });

    return store;
  };
}
