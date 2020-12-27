import { STATE_SLICE } from '../../store/constants';
import reducer, {
  UPDATE_FLAGS,
  updateFlags,
  selectFlag,
  selectFlags,
} from './flags';

describe('constants', () => {
  it('should contain `flags/updateFlags`', () => {
    expect(UPDATE_FLAGS).toEqual('@flopflip/flags/update');
  });
});

describe('action creators', () => {
  describe('when updating flags', () => {
    let flags;
    beforeEach(() => {
      flags = { a: 'b' };
    });
    it('should return `flags/updateFlags` type', () => {
      expect(updateFlags({ flags })).toEqual({
        type: UPDATE_FLAGS,
        payload: expect.any(Object),
      });
    });

    it('should return passed `flags`', () => {
      expect(updateFlags({ flags })).toEqual({
        type: expect.any(String),
        payload: { flags },
      });
    });
  });
});

describe('reducers', () => {
  describe('when updating flags', () => {
    describe('without previous flags', () => {
      let payload;
      beforeEach(() => {
        payload = {
          flags: {
            a: true,
            b: false,
          },
        };
      });

      it('should set the new flags', () => {
        const reduced = reducer(undefined, { type: UPDATE_FLAGS, payload });

        expect(reduced).toHaveProperty('a', payload.flags.a);
        expect(reduced).toHaveProperty('b', payload.flags.b);
      });
    });

    describe('with previous flags', () => {
      let payload;
      let state;
      beforeEach(() => {
        state = {
          flags: {
            d: false,
          },
        };
        payload = {
          flags: {
            a: true,
            b: false,
          },
        };
      });

      it('should merge with new flags', () => {
        const reduced = reducer(state, { type: UPDATE_FLAGS, payload });

        expect(reduced).toHaveProperty('a', payload.flags.a);
        expect(reduced).toHaveProperty('b', payload.flags.b);

        expect(reduced).toHaveProperty('c', state.flags.c);
      });
    });
  });
});

describe('selectors', () => {
  let flags;
  let state;

  beforeEach(() => {
    flags = {
      flagA: true,
      flagB: false,
    };
    state = {
      [STATE_SLICE]: {
        flags,
      },
    };
  });

  describe('selecting flags', () => {
    it('should return all flags', () => {
      expect(selectFlags(state)).toEqual(flags);
    });
  });

  describe('selecting a flag', () => {
    describe('when existing', () => {
      it('should return the flag value', () => {
        expect(selectFlag('flagA')(state)).toEqual(true);
        expect(selectFlag('flagB')(state)).toEqual(false);
      });
    });

    describe('when not existing', () => {
      it('should return `false`', () => {
        expect(selectFlag('zFlag')(state)).toEqual(false);
      });
    });
  });
});
