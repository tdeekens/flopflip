import React from 'react';
import useAdapterReconfiguration from './use-adapter-reconfiguration';

jest.mock('tiny-warning');
const reconfigure = jest.fn();

describe('when React hooks (`useContext`) is available', () => {
  beforeEach(() => {
    React.useContext = jest.fn(() => ({ reconfigure }));
  });

  it('should return a function', () => {
    expect(useAdapterReconfiguration()).toBe(reconfigure);
  });
});
