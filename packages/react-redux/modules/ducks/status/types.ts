import { AdapterStatus } from '@flopflip/types';

export type UpdateStatusAction = {
  type: string;
  payload: { status: AdapterStatus };
};
