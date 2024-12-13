import type { TAdaptersStatus, TFlagsContext } from '@flopflip/types';

import type { STATE_SLICE } from './constants';
import type { TUpdateFlagsAction, TUpdateStatusAction } from './ducks/types';

export type TState = {
  [STATE_SLICE]: {
    flags?: TFlagsContext;
    status?: TAdaptersStatus;
  };
};

export type UpdateFlagsAction = TUpdateFlagsAction;
export type UpdateStatusAction = TUpdateStatusAction;
