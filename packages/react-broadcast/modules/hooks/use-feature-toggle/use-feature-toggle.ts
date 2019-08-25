import React from 'react';
import camelCase from 'lodash/camelCase';
import warning from 'tiny-warning';
import { getIsFeatureEnabled } from '@flopflip/react';
import { FlagName, Flags, FlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggle(
  flagName: FlagName,
  flagVariation: FlagVariation = true
): Error | boolean {
  warning(
    flagName === camelCase(flagName),
    '@flopflip/react-broadcast: passed flag name does not seem to be normalized which may result in unexpected toggling. Please refer to our readme for more information: https://github.com/tdeekens/flopflip#flag-normalization'
  );

  if (typeof React.useContext === 'function') {
    const flags: Flags = React.useContext(FlagsContext);
    const isFeatureEnabled: boolean = getIsFeatureEnabled(
      flagName,
      flagVariation
    )(flags);

    React.useDebugValue({
      flagName,
      flagVariation,
      isEnabled: isFeatureEnabled,
    });

    return isFeatureEnabled;
  }

  throw new Error(
    'React hooks are not available in your currently installed version of React.'
  );
}
