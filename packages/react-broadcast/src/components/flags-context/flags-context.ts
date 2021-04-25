import type { TFlags, TFlagsContext } from '@flopflip/types';
import { adapterIdentifiers as allAdapterIdentifiers } from '@flopflip/types';
import { createContext } from 'react';

const createIntialFlagsContext = (
  adapterIdentifiers: Record<string, string>,
  initialFlags: TFlags
) =>
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
