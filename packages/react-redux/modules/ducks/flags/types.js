import type { Flags } from '../../types.js';

type UpdateFlagsAction = { type: '@flopflip/flags/update', payload: Flags };

type Action = UpdateFlagsAction;
