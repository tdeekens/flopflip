import { STATE_SLICE } from './../store';
import { mapStateToProps } from './feature-toggled';

describe('mapStateToProps', () => {
  describe('with existing `flag` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: true } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(mapStateToProps(state, { flag: 'flag1' }).isFeatureEnabled).toBe(
        true
      );
    });
  });

  describe('without existing `flag` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: {} },
      };
    });

    it('should map `isFeatureEnabled` as `false` onto `props`', () => {
      expect(mapStateToProps(state, { flag: 'flag1' }).isFeatureEnabled).toBe(
        false
      );
    });
  });

  describe('with matching `variate`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flag: 'flag1',
          variate: 'flagVariate1',
        }).isFeatureEnabled
      ).toBe(true);
    });
  });

  describe('with non-matching `variate`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flag: 'flag1',
          variate: 'flagVariate2',
        }).isFeatureEnabled
      ).toBe(false);
    });
  });

  describe('with default variate value', () => {
    let state;

    describe('with non existing flag', () => {
      beforeEach(() => {
        state = {
          [STATE_SLICE]: { flags: { flag1: undefined } },
        };
      });

      it('should map `isFeatureEnabled` as `true` onto `props`', () => {
        expect(
          mapStateToProps(state, {
            flag: 'flag1',
            variate: 'flagVariate2',
            defaultVariateValue: 'flagVariate2',
          }).isFeatureEnabled
        ).toBe(true);
      });
    });
  });
});
