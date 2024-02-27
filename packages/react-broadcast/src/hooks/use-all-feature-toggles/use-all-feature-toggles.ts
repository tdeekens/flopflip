import { type TAdapterIdentifiers, type TFlags } from '@flopflip/types';

import useFlagsContext from '../use-flags-context';

export default function useAllFeatureToggles(
  adapterIdentifiers: TAdapterIdentifiers[]
): TFlags {
  const flagsContext = useFlagsContext();

  let allFlags: TFlags = {};
  for (const adapterIdentifier of adapterIdentifiers) {
    allFlags = { ...allFlags, ...flagsContext[adapterIdentifier] };
  }

  return allFlags;
}
