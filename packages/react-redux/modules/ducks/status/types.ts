import { TAdapterStatus } from '@flopflip/types';

export type TUpdateStatusAction = {
  type: string;
  payload: { status: TAdapterStatus };
};
