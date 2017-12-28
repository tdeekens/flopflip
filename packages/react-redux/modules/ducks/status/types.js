import type { AdapterStatus } from '../../types.js';

type UpdateFlagsAction = {
  type: '@flopflip/status/update',
  payload: AdapterStatus,
};

type Action = UpdateFlagsAction;
