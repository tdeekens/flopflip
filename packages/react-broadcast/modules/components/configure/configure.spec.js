import React from 'react';
import { render as rtlRender, act } from '@flopflip/test-utils';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import { useFeatureToggle, useAdapterStatus } from '../../hooks';
import Configure from './configure';

/**
 * NOTE:
 *    The adapter under the hook triggers a set state which
 *    can not be wrapped in an act.
 */
var error = console.error;
console.error = jest.fn((message, ...remainingMessages) => {
  if (message.includes('test was not wrapped in act')) return;

  error(message, ...remainingMessages);
});

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

const createTestProps = custom => ({
  adapter,
  adapterArgs: {
    fooId: 'foo-id',
  },

  ...custom,
});

const render = () => {
  const props = createTestProps();

  return rtlRender(
    <Configure {...props}>
      <TestComponent />
    </Configure>
  );
};

describe('when feature is disabled', () => {
  it('should indicate the feature being disabled', () => {
    const rendered = render();

    expect(rendered.queryByText(/Feature enabled: No/i)).toBeInTheDocument();
  });
});

describe('when enabling feature is', () => {
  it('should indicate the feature being enabled', async () => {
    const rendered = render();

    await adapter.waitUntilConfigured();

    act(() =>
      updateFlags({
        [testFlagName]: true,
      })
    );

    expect(rendered.queryByText(/Feature enabled: Yes/i)).toBeInTheDocument();
  });
});

describe('when not configured and not ready', () => {
  it('should indicate through the adapter state', () => {
    const rendered = render();

    expect(rendered.queryByText(/Is ready: No/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Is configured: No/i)).toBeInTheDocument();
  });
});

describe('when configured and ready', () => {
  it('should indicate through the adapter state', async () => {
    const rendered = render();

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
