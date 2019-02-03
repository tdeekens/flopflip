import { FlagName, Flags, FlagVariation } from '@flopflip/types';

import React from 'react';
import camelCase from 'lodash.camelcase';
import warning from 'tiny-warning';
import { isFeatureEnabled } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggle(
  flagName: FlagName,
  flagVariation: FlagVariation = true
): () => Error | FlagVariation {
  warning(
    flagName === camelCase(flagName),
    '@flopflip/react-broadcast: passed flag name does not seem to be normalized which may result in unexpected toggling. Please refer to our readme for more information: https://github.com/tdeekens/flopflip#flag-normalization'
  );

  if (typeof React.useContext === 'function') {
    const flags: Flags = React.useContext(FlagsContext);

    return isFeatureEnabled(flagName, flagVariation)(flags);
  }

  return () => {
    throw new Error(
      'React hooks are not available in your currently installed version of React.'
    );
  };
}
