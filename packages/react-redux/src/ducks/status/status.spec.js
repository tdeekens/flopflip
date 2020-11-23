import { AdapterConfigurationStatus } from '@flopflip/types';
import { STATE_SLICE } from '../../store/constants';
import reducer, { UPDATE_STATUS, updateStatus, selectStatus } from './status';

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

    it('should return passed configuration status', () => {
      expect(
        updateStatus({
          configurationStatus: AdapterConfigurationStatus.Configured,
        })
      ).toEqual({
        type: expect.any(String),
        payload: {
          status: {
            configurationStatus: AdapterConfigurationStatus.Configured,
          },
        },
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
          status: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        };
      });

      it('should set the new status', () => {
        expect(reducer(undefined, { type: UPDATE_STATUS, payload })).toEqual(
          expect.objectContaining({
            configurationStatus: AdapterConfigurationStatus.Configuring,
          })
        );
      });
    });

    describe('with previous status', () => {
      let payload;
      beforeEach(() => {
        payload = {
          status: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        };
      });

      it('should set the new status', () => {
        expect(
          reducer(
            { configurationStatus: AdapterConfigurationStatus.Configured },
            { type: UPDATE_STATUS, payload }
          )
        ).toEqual({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        });
      });
    });
  });
});

describe('selectors', () => {
  let status;
  let state;

  beforeEach(() => {
    status = {
      configurationStatus: AdapterConfigurationStatus.Configuring,
      subscriptionStatus: {},
    };
    state = {
      [STATE_SLICE]: {
        status,
      },
    };
  });

  describe('selecting status', () => {
    it('should return configuration and ready status', () => {
      expect(selectStatus(state)).toEqual(
        expect.objectContaining({
          isConfiguring: true,
          isConfigured: false,
        })
      );
    });
  });
});
