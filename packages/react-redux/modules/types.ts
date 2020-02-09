import { TFlags, TAdapterStatus } from '@flopflip/types';
import { TUpdateStatusAction } from './ducks/status/types';
import { TUpdateFlagsAction } from './ducks/flags/types';

import { STATE_SLICE } from './store/constants';

export type TState = {
  [STATE_SLICE]: {
    flags?: TFlags;
    status?: TAdapterStatus;
  };
};

export type UpdateFlagsAction = TUpdateFlagsAction;
export type UpdateStatusAction = TUpdateStatusAction;
