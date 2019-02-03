import { Flags, AdapterStatus } from '@flopflip/types';
import { UpdateStatusAction } from './ducks/status/types';
import { UpdateFlagsAction } from './ducks/flags/types';

export type State = {
  flags?: Flags;
  status?: AdapterStatus;
};

export type UpdateFlagsAction = UpdateFlagsAction;
export type UpdateStatusAction = UpdateStatusAction;
