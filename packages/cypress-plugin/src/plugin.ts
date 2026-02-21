/// <reference types="cypress" />

import type { TAdapterIdentifiers, TFlags } from '@flopflip/types';

type TCypressPluginAddCommandOptions = {
  adapterId: TAdapterIdentifiers;
};

declare namespace Cypress {
  interface Chainable {
    updateFeatureFlags: (flags: TFlags) => Chainable;
  }
}

const FLOPFLIP_GLOBAL = '__flopflip__';

const addCommands = (options: TCypressPluginAddCommandOptions) => {
  Cypress.Commands.add(
    // @ts-expect-error Cypress doesn't seem to allow a non any chainable
    'updateFeatureFlags',
    (flags: TFlags) =>
      cy
        .window()
        .its(FLOPFLIP_GLOBAL)
        .then((flopFlipGlobal) => {
          const flopflipAdapterGlobal = flopFlipGlobal[options.adapterId];

          if (!flopflipAdapterGlobal) {
            throw new Error(
              '@flopflip/cypress: namespace or adapter of the passed id does not exist. Make sure you use one and the specified adapter.',
            );
          }

          Cypress.log({
            name: 'updateFeatureFlags',
            message: 'Updating @flopflip feature flags.',
            consoleProps: () => ({
              flags,
            }),
          });

          flopflipAdapterGlobal?.updateFlags(flags, {
            unsubscribeFlags: true,
          });
        }),
  );
};

const install = (_on) => {
  // Add event listeners if needed
};

export { addCommands, install };
