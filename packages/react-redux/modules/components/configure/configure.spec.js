import React from 'react';
import { render as rtlRender } from '@flopflip/test-utils';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import { Provider } from 'react-redux';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
import { useFeatureToggle, useAdapterStatus } from '../../hooks';
import Configure from './configure';

const testFlagName = 'firstFlag';
const TestComponent = () => {
  const { isReady, isConfigured } = useAdapterStatus();
  const isFeatureEnabled = useFeatureToggle(testFlagName);

  return (
    <ul>
      <li>Is ready: {isReady ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
      <li>Feature enabled: {isFeatureEnabled ? 'Yes' : 'No'}</li>
    </ul>
  );
};

const render = () => {
  const props = createTestProps();
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const rtlRendered = rtlRender(
    <Provider store={store}>
      <Configure {...props}>
        <TestComponent />
      </Configure>
    </Provider>
  );

  const waitUntilReady = () => rtlRendered.findByText(`Is ready: Yes`);

  return { ...rtlRendered, waitUntilReady };
};

const createTestProps = custom => ({
  adapter,
  adapterArgs: {
    fooId: 'foo-id',
  },

  ...custom,
});

describe('when feature is disabled', () => {
  it('should indicate the feature being disabled', async () => {
    const rendered = render();

    await rendered.waitUntilReady();

    expect(rendered.queryByText(/Feature enabled: No/i)).toBeInTheDocument();
  });
});

describe('when enabling feature is', () => {
  it('should indicate the feature being enabled', async () => {
    const rendered = render();

    await adapter.waitUntilConfigured();

    updateFlags({
      [testFlagName]: true,
    });

    await rendered.waitUntilReady();

    expect(rendered.queryByText(/Feature enabled: Yes/i)).toBeInTheDocument();
  });
});

describe('when not configured and not ready', () => {
  it('should indicate through the adapter state', async () => {
    const rendered = render();

    expect(rendered.queryByText(/Is ready: No/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Is configured: No/i)).toBeInTheDocument();

    await rendered.waitUntilReady();
  });
});

describe('when configured and ready', () => {
  it('should indicate through the adapter state', async () => {
    const rendered = render();

    await rendered.waitUntilReady();
    await adapter.waitUntilConfigured();

    expect(rendered.queryByText(/Is ready: Yes/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Is configured: Yes/i)).toBeInTheDocument();
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
