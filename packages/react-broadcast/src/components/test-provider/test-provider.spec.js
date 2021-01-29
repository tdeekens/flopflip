import React from 'react';
import { screen, render as rtlRender } from '@flopflip/test-utils';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import { useFeatureToggle, useAdapterStatus } from '../../hooks';
import { TestProvider } from './test-provider';

const testFlagName = 'testFlag1';
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

const render = ({ flags, status } = {}) => {
  rtlRender(
    <TestProvider flags={flags} status={status}>
      <TestComponent />
    </TestProvider>
  );
};

describe('when configured', () => {
  it('should expose the default adapter status', async () => {
    render({
      flags: {
        [testFlagName]: true,
      },
    });

    await screen.findByText(/is configured: yes/i);

    expect(screen.queryByText(/is configuring: yes/)).not.toBeInTheDocument();
  });

  it('should expose a passed adapter status', async () => {
    render({
      status: {
        subscriptionStatus: AdapterSubscriptionStatus.Unsubscribed,
        configurationStatus: AdapterConfigurationStatus.Unconfigured,
      },
    });

    await screen.findByText(/is unconfigured: yes/i);

    expect(screen.queryByText(/is configured: yes/)).not.toBeInTheDocument();
  });

  it('should expose features', async () => {
    render({
      flags: {
        [testFlagName]: true,
      },
    });

    await screen.findByText(/is configured: yes/i);

    expect(screen.getByText(/feature enabled: yes/i)).toBeInTheDocument();
  });
});
