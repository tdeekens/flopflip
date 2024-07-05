import type {
  TAdapterIdentifiers,
  TAdapterStatusChange,
} from '@flopflip/types';

export type TUpdateStatusAction = {
  type: string;
  payload: TAdapterStatusChange & {
    adapterIdentifiers: TAdapterIdentifiers[];
  };
};
