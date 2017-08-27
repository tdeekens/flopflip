import { STATE_SLICE } from './../store';
import { mapStateToProps } from './feature-toggled';

describe('mapStateToProps', () => {
  describe('with existing `flagName` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: true } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, { flagName: 'flag1' }).isFeatureEnabled
      ).toBe(true);
    });
  });

  describe('without existing `flagName` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: {} },
      };
    });

    it('should map `isFeatureEnabled` as `false` onto `props`', () => {
      expect(
        mapStateToProps(state, { flagName: 'flag1' }).isFeatureEnabled
      ).toBe(false);
    });
  });

  describe('with matching `flagVariate`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flagName: 'flag1',
          flagVariate: 'flagVariate1',
        }).isFeatureEnabled
      ).toBe(true);
    });
  });

  describe('with non-matching `flagVariate`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flagName: 'flag1',
          flagVariate: 'flagVariate2',
        }).isFeatureEnabled
      ).toBe(false);
    });
  });
});
