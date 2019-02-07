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
        payload: { status: { isReady: true } },
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
          status: { isReady: true },
        };
      });

      it('should set the new status', () => {
        expect(reducer(undefined, { type: UPDATE_STATUS, payload })).toEqual({
          status: { isReady: payload.status.isReady },
        });
      });
    });

    describe('with previous status', () => {
      let payload;
      beforeEach(() => {
        payload = {
          status: { isReady: false },
        };
      });

      it('should set the new status', () => {
        expect(
          reducer(
            { status: { isReady: true } },
            { type: UPDATE_STATUS, payload }
          )
        ).toEqual({
          status: { isReady: payload.status.isReady },
        });
      });
    });
  });
});
