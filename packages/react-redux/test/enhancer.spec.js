import {
  AdapterConfigurationStatus,
  adapterIdentifiers as allAdapterIdentifiers,
} from '@flopflip/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updateFlags, updateStatus } from '../src/ducks';
import { createFlopFlipEnhancer } from '../src/enhancer';

const adapterArgs = {
  clientSideId: '123-abc',
  user: { key: 'foo-user' },
};
const adapter = {
  id: 'test',
  configure: vi.fn(),
  reconfigure: vi.fn(),
};

describe('when creating enhancer', () => {
  let enhancer;
  beforeEach(() => {
    enhancer = createFlopFlipEnhancer(adapter, adapterArgs);
  });

  describe('with enhanced store', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = vi.fn();

      const getState = () => ({});
      const next = vi.fn(() => ({ getState, dispatch }));
      const args = [''];

      enhancer(next)(args);
    });

    it('should invoke `configure` on `adapter` with `onFlagsStateChange`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        adapterArgs,
        expect.objectContaining({
          onFlagsStateChange: expect.any(Function),
        })
      );
    });

    it('should invoke `configure` on `adapter` with `onStatusStateChange`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        adapterArgs,
        expect.objectContaining({
          onStatusStateChange: expect.any(Function),
        })
      );
    });

    describe('when invoking  `onFlagsStateChange`', () => {
      const nextFlags = {
        foo: true,
      };

      beforeEach(() => {
        const { onFlagsStateChange } =
          adapter.configure.mock.calls[
            adapter.configure.mock.calls.length - 1
          ][1];

        onFlagsStateChange(nextFlags);
      });

      it('should invoke `dispatch`', () => {
        expect(dispatch).toHaveBeenCalled();
      });

      it('should invoke `dispatch` with `updateFlags`', () => {
        expect(dispatch).toHaveBeenCalledWith(
          updateFlags(nextFlags, [adapter.id])
        );
      });
    });

    describe('when invoking  `onStatusStateChange`', () => {
      const nextStatus = {
        adapterConfigurationStatus: AdapterConfigurationStatus.Configured,
      };

      beforeEach(() => {
        const { onStatusStateChange } =
          adapter.configure.mock.calls[
            adapter.configure.mock.calls.length - 1
          ][1];

        onStatusStateChange(nextStatus);
      });

      it('should invoke `dispatch`', () => {
        expect(dispatch).toHaveBeenCalled();
      });

      it('should invoke `dispatch` with `updateStatus`', () => {
        expect(dispatch).toHaveBeenCalledWith(
          updateStatus(nextStatus, Object.keys(allAdapterIdentifiers))
        );
      });
    });
  });
});
