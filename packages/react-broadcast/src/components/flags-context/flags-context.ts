import type { TFlagsContext } from '@flopflip/types';

import { createContext } from 'react';
import { adapterInterfaceIdentifiers } from '@flopflip/types';

const intialFlagsContext = Object.fromEntries(
  Object.values(
    adapterInterfaceIdentifiers
  ).map((adapterInterfaceIdentifier) => [adapterInterfaceIdentifier, {}])
);
const FlagsContext = createContext<TFlagsContext>(intialFlagsContext);

export default FlagsContext;
