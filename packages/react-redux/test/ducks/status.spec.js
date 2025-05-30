import {
  AdapterConfigurationStatus,
  adapterIdentifiers as allAdapterIdentifiers,
} from '@flopflip/types';
import { beforeEach, describe, expect, it } from 'vitest';

import { STATE_SLICE } from '../../src/constants';
import { reducer, selectStatus, updateStatus } from '../../src/ducks/status';

describe('action creators', () => {
  describe('when updating status', () => {
    it('should return `UPDATE_STATUS` type', () => {
      expect(updateStatus({ isReady: false })).toEqual({
        type: 'status/updateStatus',
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
        expect(
          reducer(undefined, { type: 'status/updateStatus', payload })
        ).toEqual(
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
            { type: 'status/updateStatus', payload }
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
      http: {
        configurationStatus: AdapterConfigurationStatus.Unconfigured,
        subscriptionStatus: {},
      },
    };
    state = {
      [STATE_SLICE]: {
        status,
      },
    };
  });

  describe('selecting status for all', () => {
    it('should return configuration and ready status', () => {
      expect(selectStatus()(state)).toEqual(
        expect.objectContaining({
          isConfiguring: false,
          isReady: false,
          isUnconfigured: false,
        })
      );
    });
  });
  describe('selecting status for one', () => {
    it('should return unconfigured status', () => {
      expect(selectStatus({ adapterIdentifiers: ['http'] })(state)).toEqual(
        expect.objectContaining({
          isUnconfigured: true,
        })
      );
    });
    it('should return configuring status', () => {
      expect(selectStatus({ adapterIdentifiers: ['memory'] })(state)).toEqual(
        expect.objectContaining({
          isConfiguring: true,
        })
      );
    });
  });
});
