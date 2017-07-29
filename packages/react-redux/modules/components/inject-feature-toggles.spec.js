import { STATE_SLICE } from './../store';
import { mapStateToProps } from './inject-feature-toggles';

describe('mapStateToProps', () => {
  describe('with `flags` ', () => {
    const flags = { flag1: true };
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `availableFeatureToggles` onto `props`', () => {
      expect(mapStateToProps(state).availableFeatureToggles).toEqual(flags);
    });
  });

  describe('without `flags` ', () => {
    const flags = {};
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `availableFeatureToggles` onto `props`', () => {
      expect(mapStateToProps(state).availableFeatureToggles).toEqual(flags);
    });
  });
});
