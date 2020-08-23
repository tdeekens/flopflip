/// <reference types="cypress" />

import type { TAdapterInterfaceIdentifiers, TFlags } from '@flopflip/types';

type TCypressPluginAddCommandOptions = {
  adapterId: TAdapterInterfaceIdentifiers;
};

declare namespace Cypress {
  interface Chainable<Subject> {
    updateFeatureFlags: (flags: TFlags) => Chainable<Subject>;
  }
}

const FLOPFLIP_GLOBAL = '__flopflip__';

const addCommands = (options: TCypressPluginAddCommandOptions) => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    cy.window()
      .its(FLOPFLIP_GLOBAL)
      .then((flopFlipGlobal) => {
        const flopflipAdapterGlobal = flopFlipGlobal[options.adapterId];

        if (!flopflipAdapterGlobal) {
          throw new Error(
            '@flopflip/cypress: namespace or adapter of the passed id does not exist. Make sure you use one and the specified adapter.'
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

        flopflipAdapterGlobal?.updateFlags(flags, {
          unsubscribeFlags: true,
        });
      });
  });
};

const install = (_on) => {
  // Add event listeners if needed
};

export { addCommands, install };
