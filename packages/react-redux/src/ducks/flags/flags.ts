import { isNil } from '@flopflip/react';
import type {
  TAdapterIdentifiers,
  TFlagName,
  TFlagsChange,
  TFlagsContext,
  TFlagVariation,
} from '@flopflip/types';
import { Reducer } from 'redux';

import { STATE_SLICE } from '../../store/constants';
import { TState } from '../../types';
import { TUpdateFlagsAction } from './types';

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
          action.payload.adapterIdentifiers.map(
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
  adapterIdentifiers: TAdapterIdentifiers[]
): TUpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { ...flagsChange, adapterIdentifiers },
});

// Selectors
export const selectFlags = () => (state: TState) =>
  state[STATE_SLICE].flags ?? {};

export const selectFlag = (
  flagName: TFlagName,
  adapterIdentifiers: TAdapterIdentifiers[]
): ((state: TState) => TFlagVariation) => (state) => {
  const allFlags = selectFlags()(state);

  let foundFlagVariation: TFlagVariation = false;

  for (const adapterInterfaceIdentifier of adapterIdentifiers) {
    const flagValue: TFlagVariation =
      allFlags[adapterInterfaceIdentifier]?.[flagName];

    if (!isNil(flagValue)) {
      foundFlagVariation = flagValue;
    }
  }

  return foundFlagVariation;
};
