import type { Flags } from '../../types.js';

type UpdateFlagsAction = {
  type: '@flopflip/flags/update',
  payload: { flags: Flags },
};

type Action = UpdateFlagsAction;
