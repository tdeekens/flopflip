import type { AdapterStatus } from '../../types.js';

type UpdateFlagsAction = {
  type: '@flopflip/status/update',
  payload: { status: AdapterStatus },
};

type Action = UpdateFlagsAction;
