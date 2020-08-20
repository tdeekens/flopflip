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
type TCypressPluginAddCommandOptions = {
  adapter: TCypressPluginState['adapter'];
  updateFlags: TCypressPluginState['updateFlags'];
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

const addCommands = (options: TCypressPluginAddCommandOptions) => {
  state.adapter = options.adapter;
  state.updateFlags = options.updateFlags;

  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    if (!state.updateFlags) {
      throw new Error(
        '@flopflip/cypress: `updateFlags` is not defined. Pass it when installing the plugin.'
      );
    }

    state.updateFlags(flags);
  });
};

const install = (_on) => {
  // Add event listeners if needed
};

export { addCommands, install };
