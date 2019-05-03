import useAdapterStatus from './use-adapter-status';
import React from 'react';

jest.mock('tiny-warning');

describe('when React hooks (`useContext`) is available', () => {
  describe('with default variation', () => {
    describe('when flag is enabled', () => {
      let adapterStatus;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          status: { isReady: true },
        }));

        adapterStatus = useAdapterStatus();
      });

      it('should return true', () => {
        expect(adapterStatus).toHaveProperty('isReady', true);
      });
    });

    describe('when flag is disabled', () => {
      let adapterStatus;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          status: { isConfigured: false },
        }));

        adapterStatus = useAdapterStatus();
      });

      it('should return false', () => {
        expect(adapterStatus).toHaveProperty('isConfigured', false);
      });
    });
  });
});

describe('when React hooks (`useContext`) are not available', () => {
  describe('when flag is enabled', () => {
    beforeEach(() => {
      React.useContext = jest.fn(() => undefined);
    });

    it('should throw', () => {
      expect(() => useAdapterStatus()).toThrow();
    });
  });
});
