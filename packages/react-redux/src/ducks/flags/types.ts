import type {
  TFlagsChange,
  TAdapterInterfaceIdentifiers,
} from '@flopflip/types';

export type TUpdateFlagsAction = {
  type: string;
  payload: TFlagsChange & {
    adapterInterfaceIdentifiers: TAdapterInterfaceIdentifiers[];
  };
};
