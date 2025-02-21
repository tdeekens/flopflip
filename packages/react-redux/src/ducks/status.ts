import { selectAdapterConfigurationStatus } from '@flopflip/react';
import type {
  TAdapterIdentifiers,
  TAdapterStatusChange,
  TAdaptersStatus,
} from '@flopflip/types';
import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { STATE_SLICE } from '../constants';
import type { TState } from '../types';

const initialState: TAdaptersStatus = {};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateStatus: {
      reducer(
        state,
        action: PayloadAction<
          TAdapterStatusChange & { adapterIdentifiers: TAdapterIdentifiers[] }
        >
      ) {
        if (action.payload.id) {
          state[action.payload.id] = {
            ...state[action.payload.id],
            ...action.payload.status,
          };
          return;
        }

        for (const adapterInterfaceIdentifier of action.payload
          .adapterIdentifiers) {
          state[adapterInterfaceIdentifier] = {
            ...state[adapterInterfaceIdentifier],
            ...action.payload.status,
          };
        }
      },
      prepare(
        statusChange: TAdapterStatusChange,
        adapterIdentifiers: TAdapterIdentifiers[]
      ) {
        return {
          payload: { ...statusChange, adapterIdentifiers },
        };
      },
    },
  },
});

export const { updateStatus } = statusSlice.actions;
export const reducer = statusSlice.reducer;

// Selectors
type TSelectStatusArgs = {
  adapterIdentifiers?: TAdapterIdentifiers[];
};

export const selectStatus =
  ({ adapterIdentifiers }: TSelectStatusArgs = {}) =>
  (state: TState) => {
    const { status } = state[STATE_SLICE];
    return selectAdapterConfigurationStatus(status, adapterIdentifiers);
  };
