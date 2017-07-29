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
});
