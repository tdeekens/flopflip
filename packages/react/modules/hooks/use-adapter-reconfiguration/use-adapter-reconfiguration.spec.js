import React from 'react';
import useAdapterReconfiguration from './use-adapter-reconfiguration';

jest.mock('tiny-warning');
const reconfigure = jest.fn();

describe('when React hooks (`useContext`) is available', () => {
  beforeEach(() => {
    React.useContext = jest.fn(() => ({ reconfigure }));
  });

  it('should return a function', async () => {
    expect(useAdapterReconfiguration()).toBe(reconfigure);
  });
});

describe('when React hooks (`useContext`) are not available', () => {
  describe('when flag is enabled', () => {
    beforeEach(() => {
      React.useContext = jest.fn(() => undefined);
    });

    it('should throw', () => {
      expect(() => useAdapterReconfiguration()).toThrow();
    });
  });
});
