import type { TAdaptersStatus, TFlagsContext } from '@flopflip/types';

import type { TUpdateFlagsAction } from './ducks/flags/types';
import type { TUpdateStatusAction } from './ducks/status/types';
import type { STATE_SLICE } from './store/constants';

export type TState = {
  [STATE_SLICE]: {
    flags?: TFlagsContext;
    status?: TAdaptersStatus;
  };
};

export type UpdateFlagsAction = TUpdateFlagsAction;
export type UpdateStatusAction = TUpdateStatusAction;
