import useFeatureToggle from './use-feature-toggle';
import { useContext } from 'react';

jest.mock('warning');
jest.mock('react');

const flagName = 'testFlagName';

describe('with default variation', () => {
  describe('when flag is enabled', () => {
    let flagValue;
    beforeEach(() => {
      useContext.mockReturnValue({
        [flagName]: true,
      });

      flagValue = useFeatureToggle(flagName);
    });

    it('should return true', () => {
      expect(flagValue).toBe(true);
    });
  });

  describe('when flag is disabled', () => {
    let flagValue;
    beforeEach(() => {
      useContext.mockReturnValue({
        [flagName]: false,
      });

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
      useContext.mockReturnValue({
        [flagName]: 'variation-a',
      });

      flagValue = useFeatureToggle(flagName, 'variation-a');
    });

    it('should return true', () => {
      expect(flagValue).toBe(true);
    });
  });

  describe('when variation does not match', () => {
    let flagValue;
    beforeEach(() => {
      useContext.mockReturnValue({
        [flagName]: 'variation-b',
      });

      flagValue = useFeatureToggle(flagName, 'variation-a');
    });

    it('should return false', () => {
      expect(flagValue).toBe(false);
    });
  });
});
