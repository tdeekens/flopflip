import { render as rtlRender, screen } from '@flopflip/test-utils';
import { vi, describe, it, expect } from 'vitest';

import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import React from 'react';

import useAdapterSubscription from './use-adapter-subscription';

const createAdapter = () => ({
  getIsConfigurationStatus: vi.fn(
    () => AdapterConfigurationStatus.Unconfigured
  ),
  configure: vi.fn(() => Promise.resolve()),
  reconfigure: vi.fn(() => Promise.resolve()),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
});

function TestComponent({ adapter }) {
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(adapter);

  const isConfigured = adapter.getIsConfigurationStatus(
    AdapterConfigurationStatus.Configured
  );

  return (
    <>
      <h1>Test Component</h1>
      <ul>
        <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
        <li>
          Is subscribed:{' '}
          {getHasAdapterSubscriptionStatus(AdapterSubscriptionStatus.Subscribed)
            ? 'Yes'
            : 'No'}
        </li>
        <li>
          Is unsubscribed:{' '}
          {getHasAdapterSubscriptionStatus(
            AdapterSubscriptionStatus.Unsubscribed
          )
            ? 'Yes'
            : 'No'}
        </li>
      </ul>
    </>
  );
}

const render = ({ adapter }) => {
  const props = { adapter };
  const { unmount } = rtlRender(<TestComponent {...props} />);
  const waitUntilConfigured = () => Promise.resolve();

  return { waitUntilConfigured, unmount, renderProps: props };
};

describe('rendering', () => {
  it('should unsubscribe the adapter when mounting', async () => {
    const adapter = createAdapter();

    const { waitUntilConfigured, renderProps } = render({ adapter });

    await waitUntilConfigured();

    expect(renderProps.adapter.subscribe).toHaveBeenCalled();
  });

  it('should return adapter subscribtion status indicating being subscribed', async () => {
    const adapter = createAdapter();

    const { waitUntilConfigured } = render({ adapter });

    await waitUntilConfigured();

    expect(screen.getByText(/Is subscribed: Yes/i)).toBeInTheDocument();
    expect(screen.getByText(/Is unsubscribed: No/i)).toBeInTheDocument();
  });

  it('should unsubscribe the adapter when unmounting', async () => {
    const adapter = createAdapter();

    const { unmount, waitUntilConfigured, renderProps } = render({ adapter });

    await waitUntilConfigured();

    unmount();

    expect(renderProps.adapter.unsubscribe).toHaveBeenCalled();
  });
});
