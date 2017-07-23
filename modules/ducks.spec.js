import reducer, {
  UPDATE_STATUS,
  UPDATE_FLAGS,
  STATE_SLICE,
  updateStatus,
  updateFlags,
} from './ducks';

describe('constants', () => {
  it('should contain `UPDATE_STATUS`', () => {
    expect(UPDATE_STATUS).toEqual('@flopflip/UPDATE_STATUS');
  });
  it('should contain `UPDATE_FLAGS`', () => {
    expect(UPDATE_FLAGS).toEqual('@flopflip/UPDATE_FLAGS');
  });
  it('should contain `STATE_SLICE`', () => {
    expect(STATE_SLICE).toEqual('@flopflip/FEATURE_TOGGLES');
  });
});

describe('action creators', () => {
  describe('when updating status', () => {
    it('should return `UPDATE_STATUS` type', () => {
      expect(updateStatus({ isReady: false })).toEqual({
        type: UPDATE_STATUS,
        payload: expect.any(Object),
      });
    });

    it('should return passed `isReady` status', () => {
      expect(updateStatus({ isReady: true })).toEqual({
        type: expect.any(String),
        payload: { isReady: true },
      });
    });
  });

  describe('when updating flags', () => {
    let flags;
    beforeEach(() => {
      flags = { a: 'b' };
    });
    it('should return `UPDATE_FLAGS` type', () => {
      expect(updateFlags(flags)).toEqual({
        type: UPDATE_FLAGS,
        payload: expect.any(Object),
      });
    });

    it('should return passed `flags`', () => {
      expect(updateFlags(flags)).toEqual({
        type: expect.any(String),
        payload: flags,
      });
    });
  });
});

describe('reducers', () => {
  describe('when updating status', () => {
    describe('without previous status', () => {
      let payload;
      beforeEach(() => {
        payload = {
          isReady: true,
        };
      });

      it('should set the new status', () => {
        expect(reducer(undefined, { type: UPDATE_STATUS, payload })).toEqual({
          flags: expect.any(Object),
          isReady: payload.isReady,
        });
      });
    });

    describe('with previous status', () => {
      let payload;
      beforeEach(() => {
        payload = {
          isReady: false,
        };
      });

      it('should set the new status', () => {
        expect(
          reducer(
            { isReady: true, flags: {} },
            { type: UPDATE_STATUS, payload }
          )
        ).toEqual({
          flags: expect.any(Object),
          isReady: payload.isReady,
        });
      });
    });
  });

  describe('when updating flags', () => {
    describe('without previous flags', () => {
      let payload;
      beforeEach(() => {
        payload = {
          a: true,
          b: false,
        };
      });

      it('should set the new flags', () => {
        expect(reducer(undefined, { type: UPDATE_FLAGS, payload })).toEqual({
          flags: payload,
          isReady: expect.any(Boolean),
        });
      });
    });

    describe('with previous flags', () => {
      let payload;
      beforeEach(() => {
        payload = {
          a: true,
          b: false,
        };
      });

      it('should merge with new flags', () => {
        expect(
          reducer(
            { flags: { c: true }, isReady: true },
            { type: UPDATE_FLAGS, payload }
          )
        ).toEqual({
          flags: { ...payload, c: true },
          isReady: expect.any(Boolean),
        });
      });
    });
  });
});
