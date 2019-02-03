import { Flags } from '@flopflip/types';

export type UpdateFlagsAction = {
  type: string,
  payload: { flags: Flags },
};
