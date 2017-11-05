import reducer, { UPDATE_STATUS, updateStatus } from './status';

describe('constants', () => {
  it('should contain `UPDATE_STATUS`', () => {
    expect(UPDATE_STATUS).toEqual('@flopflip/status/update');
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
          reducer({ isReady: true }, { type: UPDATE_STATUS, payload })
        ).toEqual({
          isReady: payload.isReady,
        });
      });
    });
  });
});
