import { type TAdapterIdentifiers, type TFlags } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from '../../ducks/flags';

export default function useAllFeatureToggles(
  adapterIdentifiers: TAdapterIdentifiers
): TFlags {
  const allFlags = useSelector(selectFlags());

  let allFlagsFromAdapterIdentifers: TFlags = {};
  for (const adapterIdentifier of adapterIdentifiers) {
    allFlagsFromAdapterIdentifers = {
      ...allFlagsFromAdapterIdentifers,
      ...allFlags[adapterIdentifier],
    };
  }

  return allFlagsFromAdapterIdentifers;
}
