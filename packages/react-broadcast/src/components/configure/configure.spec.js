import adapter from '@flopflip/memory-adapter';
import { act, render as rtlRender, screen } from '@flopflip/test-utils';
import React from 'react';

import { useAdapterStatus, useFeatureToggle } from '../../hooks';
import Configure from './configure';

const testFlagName = 'firstFlag';
const TestComponent = () => {
  const { isUnconfigured, isConfiguring, isConfigured } = useAdapterStatus();

  const isFeatureEnabled = useFeatureToggle(testFlagName);

  return (
    <ul>
      <li>Is unconfigured: {isUnconfigured ? 'Yes' : 'No'}</li>
      <li>Is configuring: {isConfiguring ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
      <li>Feature enabled: {isFeatureEnabled ? 'Yes' : 'No'}</li>
    </ul>
  );
};

const createTestProps = (custom) => ({
  adapter,
  adapterArgs: {
    fooId: 'foo-id',
  },

  ...custom,
});

const render = () => {
  const props = createTestProps();
  rtlRender(
    <Configure {...props}>
      <TestComponent />
    </Configure>
  );
  const waitUntilConfigured = () => screen.findByText(/Is configured: Yes/i);

  return { waitUntilConfigured };
};

describe('when feature is disabled', () => {
  it('should indicate the feature being disabled', async () => {
    const { waitUntilConfigured } = render();

    await waitUntilConfigured();

    expect(screen.getByText(/Feature enabled: No/i)).toBeInTheDocument();
  });
});

describe('when enabling feature', () => {
  it('should indicate the feature being enabled', async () => {
    const { waitUntilConfigured } = render();

    await waitUntilConfigured();

    act(() => {
      adapter.updateFlags({
        [testFlagName]: true,
      });
    });

    expect(screen.getByText(/Feature enabled: Yes/i)).toBeInTheDocument();
  });

  it('should not reconfigure the adapter multiple times', async () => {
    const { waitUntilConfigured } = render();
    const spy = jest.spyOn(adapter, 'reconfigure');

    await waitUntilConfigured();

    act(() => {
      adapter.updateFlags({
        [testFlagName]: true,
      });
    });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('when configured', () => {
  it('should indicate through the adapter state', async () => {
    const { waitUntilConfigured } = render();

    await waitUntilConfigured();

    expect(screen.getByText(/Is configuring: No/i)).toBeInTheDocument();
    expect(screen.getByText(/Is configured: Yes/i)).toBeInTheDocument();
  });
});

describe('statics', () => {
  describe('displayName', () => {
    it('should be set to `ConfigureFlopflip`', () => {
      expect(Configure.displayName).toEqual('ConfigureFlopflip');
    });
  });

  describe('defaultProps', () => {
    it('should default `defaultFlags` to an empty object', () => {
      expect(Configure.defaultProps.defaultFlags).toEqual({});
    });

    it('should default `shouldDeferAdapterConfiguration` to `true`', () => {
      expect(Configure.defaultProps.shouldDeferAdapterConfiguration).toBe(
        false
      );
    });
  });
});
