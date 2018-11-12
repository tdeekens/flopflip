import useFeatureToggle from './use-feature-toggle';
import React from 'react';

jest.mock('tiny-warning');

const flagName = 'testFlagName';

describe('when React hooks (`useContext`) is available', () => {
  describe('with default variation', () => {
    describe('when flag is enabled', () => {
      let flagValue;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          [flagName]: true,
        }));

        flagValue = useFeatureToggle(flagName);
      });

      it('should return true', () => {
        expect(flagValue).toBe(true);
      });
    });

    describe('when flag is disabled', () => {
      let flagValue;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          [flagName]: false,
        }));

        flagValue = useFeatureToggle(flagName);
      });

      it('should return false', () => {
        expect(flagValue).toBe(false);
      });
    });
  });

  describe('with custom variation', () => {
    describe('when variation matches', () => {
      let flagValue;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          [flagName]: 'variation-a',
        }));

        flagValue = useFeatureToggle(flagName, 'variation-a');
      });

      it('should return true', () => {
        expect(flagValue).toBe(true);
      });
    });

    describe('when variation does not match', () => {
      let flagValue;
      beforeEach(() => {
        React.useContext = jest.fn(() => ({
          [flagName]: 'variation-b',
        }));

        flagValue = useFeatureToggle(flagName, 'variation-a');
      });

      it('should return false', () => {
        expect(flagValue).toBe(false);
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
      expect(() => useFeatureToggle(flagName)).toThrow();
    });
  });
});
