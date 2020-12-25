import React from 'react';
import { render as rtlRender, act } from '@flopflip/test-utils';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import { useFeatureToggle, useAdapterStatus } from '../../hooks';
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

const createTestProps = custom => ({
  adapter,
  adapterArgs: {
    fooId: 'foo-id',
  },

  ...custom,
});

const render = () => {
  const props = createTestProps();
  const rendered = rtlRender(
    <Configure {...props}>
      <TestComponent />
    </Configure>
  );
  const waitUntilConfigured = () => rendered.findByText(/Is configured: Yes/i);

  return { ...rendered, waitUntilConfigured };
};

describe('when feature is disabled', () => {
  it('should indicate the feature being disabled', async () => {
    const rendered = render();

    await rendered.waitUntilConfigured();

    expect(rendered.getByText(/Feature enabled: No/i)).toBeInTheDocument();
  });
});

describe('when enabling feature is', () => {
  it('should indicate the feature being enabled', async () => {
    const rendered = render();

    await rendered.waitUntilConfigured();

    act(() => {
      updateFlags({
        [testFlagName]: true,
      });
    });

    expect(rendered.getByText(/Feature enabled: Yes/i)).toBeInTheDocument();
  });
});

describe('when unconfigured', () => {
  it('should indicate through the adapter state', async () => {
    const rendered = render();

    expect(rendered.getByText(/Is unconfigured: Yes/i)).toBeInTheDocument();
    expect(rendered.getByText(/Is configuring: No/i)).toBeInTheDocument();
    expect(rendered.getByText(/Is configured: No/i)).toBeInTheDocument();

    await rendered.waitUntilConfigured();
  });
});

describe('when configured', () => {
  it('should indicate through the adapter state', async () => {
    const rendered = render();

    await rendered.waitUntilConfigured();

    expect(rendered.getByText(/Is configuring: No/i)).toBeInTheDocument();
    expect(rendered.getByText(/Is configured: Yes/i)).toBeInTheDocument();
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
