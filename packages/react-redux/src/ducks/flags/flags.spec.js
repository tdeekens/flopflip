import { STATE_SLICE } from '../../store/constants';
import reducer, {
  UPDATE_FLAGS,
  updateFlags,
  selectFlag,
  selectFlags,
} from './flags';

const adapterInterfaceIdentifiers = ['memory'];

describe('constants', () => {
  it('should contain `flags/updateFlags`', () => {
    expect(UPDATE_FLAGS).toEqual('@flopflip/flags/update');
  });
});

describe('action creators', () => {
  describe('when updating flags', () => {
    const flags = { a: 'b' };

    it('should return `flags/updateFlags` type', () => {
      expect(updateFlags({ flags }, adapterInterfaceIdentifiers)).toEqual({
        type: UPDATE_FLAGS,
        payload: expect.any(Object),
      });
    });

    it('should return passed `flags`', () => {
      expect(updateFlags({ flags }, adapterInterfaceIdentifiers)).toEqual({
        type: expect.any(String),
        payload: expect.objectContaining({ flags }),
      });
    });

    it('should return passed `adapterInterfaceIdentifiers`', () => {
      expect(updateFlags({ flags }, adapterInterfaceIdentifiers)).toEqual({
        type: expect.any(String),
        payload: expect.objectContaining({ adapterInterfaceIdentifiers }),
      });
    });
  });
});

describe('reducers', () => {
  describe('when updating flags', () => {
    describe('without previous flags', () => {
      describe('with id', () => {
        const payload = {
          id: ['memory'],
          flags: {
            a: true,
            b: false,
          },
        };
        it('should set the new flags', () => {
          const reduced = reducer(undefined, { type: UPDATE_FLAGS, payload });
          expect(reduced).toHaveProperty('memory.a', payload.flags.a);
          expect(reduced).toHaveProperty('memory.b', payload.flags.b);
        });
      });

      describe('without id', () => {
        const payload = {
          adapterInterfaceIdentifiers: ['memory', 'graphql'],
          flags: {
            a: true,
            b: false,
          },
        };

        it('should set the new flags for all adapter interfaces', () => {
          const reduced = reducer(undefined, { type: UPDATE_FLAGS, payload });
          expect(reduced).toHaveProperty('memory.a', payload.flags.a);
          expect(reduced).toHaveProperty('memory.b', payload.flags.b);

          expect(reduced).toHaveProperty('graphql.a', payload.flags.a);
          expect(reduced).toHaveProperty('graphql.b', payload.flags.b);
        });
      });
    });

    describe('with previous flags', () => {
      describe('with id', () => {
        const payload = {
          id: ['memory'],
          flags: {
            a: true,
            b: false,
          },
        };
        const state = {
          memory: {
            c: false,
          },
        };

        it('should merge with new flags', () => {
          const reduced = reducer(state, { type: UPDATE_FLAGS, payload });

          expect(reduced).toHaveProperty('memory.a', payload.flags.a);
          expect(reduced).toHaveProperty('memory.b', payload.flags.b);
          expect(reduced).toHaveProperty('memory.c', state.memory.c);
        });
      });

      describe('without id', () => {
        const payload = {
          adapterInterfaceIdentifiers: ['memory', 'graphql'],
          flags: {
            a: true,
            b: false,
          },
        };
        const state = {
          memory: {
            c: false,
          },
        };

        it('should merge with new flags', () => {
          const reduced = reducer(state, { type: UPDATE_FLAGS, payload });

          expect(reduced).toHaveProperty('memory.a', payload.flags.a);
          expect(reduced).toHaveProperty('memory.b', payload.flags.b);
          expect(reduced).toHaveProperty('graphql.a', payload.flags.a);
          expect(reduced).toHaveProperty('graphql.b', payload.flags.b);

          expect(reduced).toHaveProperty('memory.c', state.memory.c);
        });
      });
    });
  });
});

describe('selectors', () => {
  const memoryFlags = {
    flagA: true,
    flagB: false,
  };
  const graphqlFlags = {
    flagA: false,
    flagC: true,
  };
  const state = {
    [STATE_SLICE]: {
      flags: {
        memory: memoryFlags,
        graphql: graphqlFlags,
      },
    },
  };

  describe('selecting flags', () => {
    it('should return all flags for the adapter interface', () => {
      expect(selectFlags()(state)).toEqual(state[STATE_SLICE].flags);
    });
  });

  describe('selecting a flag', () => {
    describe('when existing', () => {
      it('should return the flag value', () => {
        expect(selectFlag('flagA', 'memory')(state)).toEqual(true);
        expect(selectFlag('flagB', 'memory')(state)).toEqual(false);
        expect(selectFlag('flagC', 'graphql')(state)).toEqual(true);
      });
    });

    describe('when not existing', () => {
      it('should return `false`', () => {
        expect(selectFlag('zFlag', 'memory')(state)).toEqual(false);
      });
    });
  });
});
