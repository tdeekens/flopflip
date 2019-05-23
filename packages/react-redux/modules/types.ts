import { Flags, AdapterStatus } from '@flopflip/types';
import { UpdateStatusAction } from './ducks/status/types';
import { UpdateFlagsAction } from './ducks/flags/types';
import { STATE_SLICE } from './store';

export type State = {
  [STATE_SLICE]: {
    flags?: Flags;
    status?: AdapterStatus;
  };
};

export type UpdateFlagsAction = UpdateFlagsAction;
export type UpdateStatusAction = UpdateStatusAction;
