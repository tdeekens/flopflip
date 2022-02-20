import React from 'react';

import useAdapterReconfiguration from './use-adapter-reconfiguration';

const reconfigure = vi.fn();

it('should return a function', () => {
  React.useContext = vi.fn(() => ({ reconfigure }));
  expect(useAdapterReconfiguration()).toBe(reconfigure);
});
