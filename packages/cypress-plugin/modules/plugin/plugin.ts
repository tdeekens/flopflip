/// <reference types="cypress" />

import type {
  TFlags,
  TLaunchDarklyAdapterInterface,
  TLocalStorageAdapterInterface,
  TMemoryAdapterInterface,
  TSplitioAdapterInterface,
} from '@flopflip/types';

type TCypressPluginState = {
  adapter?:
    | TLaunchDarklyAdapterInterface
    | TLocalStorageAdapterInterface
    | TMemoryAdapterInterface
    | TSplitioAdapterInterface;
  updateFlags?: (flags: TFlags) => void;
};
declare namespace Cypress {
  interface Chainable<Subject> {
    updateFeatureFlags: (flags: TFlags) => Chainable<Subject>;
  }
}

const state: TCypressPluginState = {
  adapter: undefined,
  updateFlags: undefined,
};

const addCommands = () => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    if (!state.updateFlags) {
      throw new Error(
        '@flopflip/cypress: `updateFlags` is not defined. Pass it when installing the plugin.'
      );
    }

    state.updateFlags(flags);
  });
};

const install = (
  _on,
  adapter: TCypressPluginState['adapter'],
  updateFlags: TCypressPluginState['updateFlags']
) => {
  state.adapter = adapter;
  state.updateFlags = updateFlags;
};

export { addCommands, install };
