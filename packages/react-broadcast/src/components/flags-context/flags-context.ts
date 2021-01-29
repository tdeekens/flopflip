import type { TFlagsContext } from '@flopflip/types';

import { createContext } from 'react';
import { adapterIdentifiers as allAdapterIdentifiers } from '@flopflip/types';

const createIntialFlagsContext = (adapterIdentifiers, initialFlags) =>
  Object.fromEntries(
    Object.values(adapterIdentifiers).map((adapterInterfaceIdentifier) => [
      adapterInterfaceIdentifier,
      initialFlags,
    ])
  );

const FlagsContext = createContext<TFlagsContext>(
  createIntialFlagsContext(allAdapterIdentifiers, {})
);

export default FlagsContext;
export { createIntialFlagsContext };
