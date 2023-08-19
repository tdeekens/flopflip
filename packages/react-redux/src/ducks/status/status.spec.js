import {
  AdapterConfigurationStatus,
  adapterIdentifiers as allAdapterIdentifiers,
} from '@flopflip/types';

import { STATE_SLICE } from '../../store/constants';
import reducer, { selectStatus, UPDATE_STATUS, updateStatus } from './status';

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

    describe('with id in payload', () => {
      it('should return passed configuration status', () => {
        expect(
          updateStatus({
            id: 'memory',
            status: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
          })
        ).toEqual({
          type: expect.any(String),
          payload: {
            id: 'memory',
            status: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
          },
        });
      });
    });

    describe('without id in payload', () => {
      it('should return passed configuration status for all adapters', () => {
        expect(
          updateStatus(
            {
              status: {
                configurationStatus: AdapterConfigurationStatus.Configured,
              },
            },
            allAdapterIdentifiers
          )
        ).toEqual({
          type: expect.any(String),
          payload: {
            adapterIdentifiers: allAdapterIdentifiers,
            status: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
          },
        });
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
          id: 'memory',
          status: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        };
      });

      it('should set the new status', () => {
        expect(reducer(undefined, { type: UPDATE_STATUS, payload })).toEqual(
          expect.objectContaining({
            memory: {
              configurationStatus: AdapterConfigurationStatus.Configuring,
            },
          })
        );
      });
    });

    describe('with previous status', () => {
      let payload;
      beforeEach(() => {
        payload = {
          id: 'memory',
          status: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        };
      });

      it('should set the new status', () => {
        expect(
          reducer(
            {
              memory: {
                configurationStatus: AdapterConfigurationStatus.Configured,
              },
            },
            { type: UPDATE_STATUS, payload }
          )
        ).toEqual({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
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
      memory: {
        configurationStatus: AdapterConfigurationStatus.Configuring,
        subscriptionStatus: {},
      },
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
