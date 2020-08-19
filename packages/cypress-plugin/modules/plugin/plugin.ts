import type { TFlags } from '@flopflip/types';

const addCommands = ({ updateFlags }) => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    updateFlags(flags);
  });
};

export { addCommands };
