import type {
  TAdapterIdentifiers,
  TAdapterStatusChange,
  TFlagsChange,
} from '@flopflip/types';

export type TUpdateStatusAction = {
  type: string;
  payload: TAdapterStatusChange & {
    adapterIdentifiers: TAdapterIdentifiers[];
  };
};

export type TUpdateFlagsAction = {
  type: string;
  payload: TFlagsChange & {
    adapterIdentifiers: TAdapterIdentifiers[];
  };
};
