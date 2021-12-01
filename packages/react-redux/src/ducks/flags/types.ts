import { type TAdapterIdentifiers, type TFlagsChange } from '@flopflip/types';

export type TUpdateFlagsAction = {
  type: string;
  payload: TFlagsChange & {
    adapterIdentifiers: TAdapterIdentifiers[];
  };
};
