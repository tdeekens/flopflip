import React from 'react';
import useAdapterReconfiguration from './use-adapter-reconfiguration';

const reconfigure = jest.fn();

it('should return a function', () => {
  React.useContext = jest.fn(() => ({ reconfigure }));
  expect(useAdapterReconfiguration()).toBe(reconfigure);
});
