import { TAdapterSubscriptionStatus } from '@flopflip/types';
import React from 'react';
import { render as rtlRender } from '@flopflip/test-utils';
import useAdapterSubscription from './use-adapter-subscription';

const createAdapter = () => ({
  getIsReady: jest.fn(() => false),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
});

const TestComponent = props => {
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

  const isReady = props.adapter.getIsReady();

  return (
    <>
      <h1>Test Component</h1>;
      <ul>
        <li>Is ready: {isReady ? 'Yes' : 'No'}</li>
        <li>
          Is subscribed:{' '}
          {getHasAdapterSubscriptionStatus(
            TAdapterSubscriptionStatus.Subscribed
          )
            ? 'Yes'
            : 'No'}
        </li>
        <li>
          Is unsubscribed:{' '}
          {getHasAdapterSubscriptionStatus(
            TAdapterSubscriptionStatus.Unsubscribed
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
  const waitUntilReady = () => Promise.resolve();

  return { ...rendered, waitUntilReady, props };
};

describe('rendering', () => {
  const adapter = createAdapter();

  it('should unsubscribe the adapter when mounting', async () => {
    const rendered = render({ adapter });

    await rendered.waitUntilReady();

    expect(rendered.props.adapter.subscribe).toHaveBeenCalled();
  });

  it('should return adapter subscribtion status indicating being subscribed', async () => {
    const rendered = render({ adapter });

    await rendered.waitUntilReady();

    expect(rendered.queryByText(/Is subscribed: Yes/i)).toBeInTheDocument();
    expect(rendered.queryByText(/Is unsubscribed: No/i)).toBeInTheDocument();
  });

  it('should unsubscribe the adapter when unmounting', async () => {
    const rendered = render({ adapter });

    await rendered.waitUntilReady();

    rendered.unmount();

    expect(rendered.props.adapter.unsubscribe).toHaveBeenCalled();
  });
});
