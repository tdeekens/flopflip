import React from 'react';
import { render as rtlRender, act } from '@flopflip/test-utils';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import { useFeatureToggle, useAdapterStatus } from '../../hooks';
import TestContextProvider from './test-context-provider';

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
  const rendered = rtlRender(
    <TestContextProvider flags={flags} status={status}>
      <TestComponent />
    </TestContextProvider>
  );

  return rendered;
};

describe('when configured', () => {
  it('should expose the default adapter status', async () => {
    const rendered = render({
      flags: {
        [testFlagName]: true,
      },
    });

    await rendered.findByText(/is configured: yes/i);

    expect(rendered.queryByText(/is configuring: yes/)).not.toBeInTheDocument();
  });

  it('should expose a passed adapter status', async () => {
    const rendered = render({
      status: {
        subscriptionStatus: AdapterSubscriptionStatus.Unsubscribed,
        configurationStatus: AdapterConfigurationStatus.Unconfigured,
      },
    });

    await rendered.findByText(/is unconfigured: yes/i);

    expect(rendered.queryByText(/is configured: yes/)).not.toBeInTheDocument();
  });

  it('should expose features', async () => {
    const rendered = render({
      flags: {
        [testFlagName]: true,
      },
    });

    await rendered.findByText(/is configured: yes/i);

    expect(rendered.getByText(/feature enabled: yes/i)).toBeInTheDocument();
  });
});
