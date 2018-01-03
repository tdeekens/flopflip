import type { Flags } from '@flopflip/types';

type UpdateFlagsAction = {
  type: '@flopflip/flags/update',
  payload: { flags: Flags },
};

type Action = UpdateFlagsAction;
