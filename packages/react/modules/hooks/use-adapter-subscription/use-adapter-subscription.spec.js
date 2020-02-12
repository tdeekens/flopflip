import React from 'react';
import { render as rtlRender } from '@flopflip/test-utils';
import useAdapterSubscription from './use-adapter-subscription';

const createAdapter = () => ({
  getIsReady: jest.fn(() => false),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),
  subscribe: jest.fn(() => Promise.resolve()),
  unsubscribe: jest.fn(() => Promise.resolve()),
});

const TestComponent = props => {
  useAdapterSubscription(props.adapter);

  const isReady = props.adapter.getIsReady();

  return (
    <>
      <h1>Test Component</h1>;
      <ul>
        <li>Is ready: {isReady}</li>
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

  it('should unsubscribe the adapter when unmounting', async () => {
    const rendered = render({ adapter });

    await rendered.waitUntilReady();

    rendered.unmount();

    expect(rendered.props.adapter.unsubscribe).toHaveBeenCalled();
  });
});
