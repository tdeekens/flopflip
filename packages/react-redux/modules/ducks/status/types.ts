import type { TAdapterStatusChange } from '@flopflip/types';

export type TUpdateStatusAction = {
  type: string;
  payload: { status: TAdapterStatusChange };
};
