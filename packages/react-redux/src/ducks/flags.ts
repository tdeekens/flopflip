import { isNil } from '@flopflip/react';
import type {
  TAdapterIdentifiers,
  TFlagName,
  TFlagVariation,
  TFlagsChange,
  TFlagsContext,
} from '@flopflip/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { STATE_SLICE } from '../constants';
import type { TState } from '../types';

const initialState: TFlagsContext = { memory: {} };

const flagsSlice = createSlice({
  name: 'flags',
  initialState,
  reducers: {
    updateFlags: {
      reducer(
        state,
        action: PayloadAction<
          TFlagsChange & { adapterIdentifiers: TAdapterIdentifiers[] }
        >
      ) {
        if (action.payload.id) {
          state[action.payload.id] = {
            ...state[action.payload.id],
            ...action.payload.flags,
          };
          return;
        }

        for (const adapterId of action.payload.adapterIdentifiers) {
          state[adapterId] = {
            ...state[adapterId],
            ...action.payload.flags,
          };
        }
      },
      prepare(
        flagsChange: TFlagsChange,
        adapterIdentifiers: TAdapterIdentifiers[]
      ) {
        return {
          payload: { ...flagsChange, adapterIdentifiers },
        };
      },
    },
  },
});

export const { updateFlags } = flagsSlice.actions;
export const reducer = flagsSlice.reducer;

export const createReducer = (preloadedState: TFlagsContext = initialState) => {
  // biome-ignore lint/style/useDefaultParameterLast: <explanation>
  return (state = preloadedState, action: ReturnType<typeof updateFlags>) =>
    reducer(state, action);
};

export const selectFlags = () => (state: TState) =>
  state[STATE_SLICE].flags ?? {};

export const selectFlag =
  (flagName: TFlagName, adapterIdentifiers: TAdapterIdentifiers[]) =>
  (state: TState): TFlagVariation => {
    const allFlags = selectFlags()(state);
    let foundFlagVariation: TFlagVariation = false;

    for (const adapterId of adapterIdentifiers) {
      const flagValue = allFlags[adapterId]?.[flagName];
      if (!isNil(flagValue)) {
        foundFlagVariation = flagValue;
      }
    }

    return foundFlagVariation;
  };
