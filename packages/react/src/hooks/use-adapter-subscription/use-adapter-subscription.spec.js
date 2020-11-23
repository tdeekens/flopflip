import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
} from '@flopflip/types';
import React from 'react';
import { render as rtlRender } from '@flopflip/test-utils';
import useAdapterSubscription from './use-adapter-subscription';

const createAdapter = () => ({
  getIsConfigurationStatus: jest.fn(
    () => AdapterConfigurationStatus.Unconfigured
  ),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
});

const TestComponent = (props) => {
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

  const isConfigured = props.adapter.getIsConfigurationStatus(
    AdapterConfigurationStatus.Configured
  );

  return (
    <>
      <h1>Test Component</h1>;
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
};

const render = ({ adapter }) => {
  const props = { adapter };
  const rendered = rtlRender(<TestComponent {...props} />);
  const waitUntilConfigured = () => Promise.resolve();

  return { ...rendered, waitUntilConfigured, props };
};

describe('rendering', () => {
  it('should unsubscribe the adapter when mounting', async () => {
    const adapter = createAdapter();

    const rendered = render({ adapter });

    await rendered.waitUntilConfigured();

    expect(rendered.props.adapter.subscribe).toHaveBeenCalled();
  });

  it('should return adapter subscribtion status indicating being subscribed', async () => {
    const adapter = createAdapter();

    const rendered = render({ adapter });

    await rendered.waitUntilConfigured();

    expect(rendered.getByText(/Is subscribed: Yes/i)).toBeInTheDocument();
    expect(rendered.getByText(/Is unsubscribed: No/i)).toBeInTheDocument();
  });

  it('should unsubscribe the adapter when unmounting', async () => {
    const adapter = createAdapter();

    const rendered = render({ adapter });

    await rendered.waitUntilConfigured();

    rendered.unmount();

    expect(rendered.props.adapter.unsubscribe).toHaveBeenCalled();
  });
});
