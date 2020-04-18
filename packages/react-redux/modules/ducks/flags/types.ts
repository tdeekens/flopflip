import type { TFlags } from '@flopflip/types';

export type TUpdateFlagsAction = {
  type: string;
  payload: { flags: TFlags };
};
