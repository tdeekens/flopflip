import type { TFlagsChange } from '@flopflip/types';

export type TUpdateFlagsAction = {
  type: string;
  payload: TFlagsChange;
};
