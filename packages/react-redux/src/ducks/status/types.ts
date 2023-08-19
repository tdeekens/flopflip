import {
  type TAdapterIdentifiers,
  type TAdapterStatusChange,
} from '@flopflip/types';

export type TUpdateStatusAction = {
  type: string;
  payload: TAdapterStatusChange & {
    adapterIdentifiers: TAdapterIdentifiers[];
  };
};
