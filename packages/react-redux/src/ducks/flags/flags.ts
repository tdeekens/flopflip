import type {
  TFlagName,
  TFlagVariation,
  TFlagsContext,
  TFlagsChange,
  TAdapterInterfaceIdentifiers,
} from '@flopflip/types';

import { isNil } from '@flopflip/react';
import { TUpdateFlagsAction } from './types.js';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';
import { Reducer } from 'redux';

// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

const initialState: TFlagsContext = { memory: {} };

// Reducer
const reducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: TFlagsContext = initialState,
  action: TUpdateFlagsAction
): TFlagsContext => {
  switch (action.type) {
    case UPDATE_FLAGS: {
      if (action.payload.id) {
        return {
          ...state,
          [action.payload.id]: {
            ...state?.[action.payload.id],
            ...action.payload.flags,
          },
        };
      }

      return {
        ...state,
        ...Object.fromEntries(
          action.payload.adapterInterfaceIdentifiers.map(
            (adapterInterfaceIdentifier) => [
              adapterInterfaceIdentifier,
              {
                ...state?.[adapterInterfaceIdentifier],
                ...action.payload.flags,
              },
            ]
          )
        ),
      };
    }

    default:
      return state;
  }
};

export default reducer;

export const createReducer = (
  preloadedState: TFlagsContext = initialState
): Reducer<TFlagsContext, TUpdateFlagsAction> => (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = preloadedState,
  action
) => reducer(state, action);

// Action Creators
export const updateFlags = (
  flagsChange: TFlagsChange,
  adapterInterfaceIdentifiers: TAdapterInterfaceIdentifiers[]
): TUpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { ...flagsChange, adapterInterfaceIdentifiers },
});

// Selectors
export const selectFlags = () => (state: TState) =>
  state[STATE_SLICE].flags ?? {};

export const selectFlag = (
  flagName: TFlagName,
  adapterInterfaceIdentifier: TAdapterInterfaceIdentifiers
): ((state: TState) => TFlagVariation) => (state) => {
  const allFlags = selectFlags()(state);
  const flagValue: TFlagVariation =
    allFlags[adapterInterfaceIdentifier]?.[flagName];

  return isNil(flagValue) ? false : flagValue;
};
