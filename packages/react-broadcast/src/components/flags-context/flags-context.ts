import type { TFlagsContext } from '@flopflip/types';

import { createContext } from 'react';
import { adapterIdentifiers } from '@flopflip/types';

const intialFlagsContext = Object.fromEntries(
  Object.values(adapterIdentifiers).map((adapterInterfaceIdentifier) => [
    adapterInterfaceIdentifier,
    {},
  ])
);
const FlagsContext = createContext<TFlagsContext>(intialFlagsContext);

export default FlagsContext;
