import type { TFlags } from '@flopflip/types';

const state = {};

const addCommands = () => {
  Cypress.Commands.add('updateFeatureFlags', (flags: TFlags) => {
    state.updateFlags(flags);
  });
};

const install = (on, adapter, updateFlags) => {
  state.adapter = adapter;
  state.updateFlags = updateFlags;
};

export { addCommands, install };
