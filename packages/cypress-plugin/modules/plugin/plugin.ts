/// <reference types="cypress" />

import type { TAdapterInterfaceIdentifiers, TFlags } from '@flopflip/types';

import getGlobalThis from 'globalthis';

type TCypressPluginAddCommandOptions = {
  adapterId: TAdapterInterfaceIdentifiers;
};

declare namespace Cypress {
  interface Chainable<Subject> {
    updateFeatureFlags: (flags: TFlags) => Chainable<Subject>;
  }
}

const addCommands = (options: TCypressPluginAddCommandOptions) => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    const globalThis = getGlobalThis();

    if (!globalThis[options.adapterId]) {
      throw new Error(
        '@flopflip/cypress: adapter of the passed id does not exist. Make sure you use the right adapter.'
      );
    }

    Cypress.log({
      name: 'updateFeatureFlags',
      message: 'Updating @flopflip feature flags.',
      consoleProps: () => {
        return {
          flags,
        };
      },
    });

    globalThis[options.adapterId].updateFlags(flags, {
      unsubscribeFlags: true,
    });
  });
};

const install = (_on) => {
  // Add event listeners if needed
};

export { addCommands, install };
