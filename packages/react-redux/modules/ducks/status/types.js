import type { AdapterStatus } from '@flopflip/types';

type UpdateFlagsAction = {
  type: '@flopflip/status/update',
  payload: { status: AdapterStatus },
};

type Action = UpdateFlagsAction;
