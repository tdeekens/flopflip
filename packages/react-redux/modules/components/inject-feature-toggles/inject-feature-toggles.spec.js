import { ALL_FLAGS } from '@flopflip/react';
import { STATE_SLICE } from './../../store';
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

    it('should map `flags` as `ALL_FLAGS` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS]).toEqual(flags);
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

    it('should map `flags` as `ALL_FLAGS` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS]).toEqual(flags);
    });
  });
});
