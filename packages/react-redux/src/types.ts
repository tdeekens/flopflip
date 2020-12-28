import type { TFlagsContext, TAdapterStatus } from '@flopflip/types';
import type { TUpdateStatusAction } from './ducks/status/types';
import type { TUpdateFlagsAction } from './ducks/flags/types';

import { STATE_SLICE } from './store/constants';

export type TState = {
  [STATE_SLICE]: {
    flags?: TFlagsContext;
    status?: TAdapterStatus;
  };
};

export type UpdateFlagsAction = TUpdateFlagsAction;
export type UpdateStatusAction = TUpdateStatusAction;
