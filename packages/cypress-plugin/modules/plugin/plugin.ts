import type { TFlags } from '@flopflip/types';

const addCommands = ({ updateFlags }) => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    updateFlags(flags);
  });
};

const install = (_on) => {
  // Fill in with event handlers when needed.
};

export { addCommands, install };
