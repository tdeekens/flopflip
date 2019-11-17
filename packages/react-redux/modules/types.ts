import { Flags, AdapterStatus } from '@flopflip/types';
import { UpdateStatusAction as TUpdateStatusAction } from './ducks/status/types';
import { UpdateFlagsAction as TUpdateFlagsAction } from './ducks/flags/types';
import { STATE_SLICE } from './store';

export type State = {
  [STATE_SLICE]: {
    flags?: Flags;
    status?: AdapterStatus;
  };
};

export type UpdateFlagsAction = TUpdateFlagsAction;
export type UpdateStatusAction = TUpdateStatusAction;
