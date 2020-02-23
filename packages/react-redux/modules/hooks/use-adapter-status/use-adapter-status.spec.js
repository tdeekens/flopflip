import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
import useAdapterStatus from './use-adapter-status';
import Configure from '../../components/configure';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

const TestComponent = () => {
  const { isReady, isConfigured } = useAdapterStatus();

  return (
    <ul>
      <li>Is ready: {isReady ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
    </ul>
  );
};

it('should indicate the adapter not being ready', () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const rendered = render(store, <TestComponent />);

  expect(rendered.queryByText('Is ready: No')).toBeInTheDocument();
});

it('should indicate the adapter being ready', async () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const rendered = render(store, <TestComponent />);

  await rendered.waitUntilReady();

  expect(rendered.queryByText('Is ready: Yes')).toBeInTheDocument();
});

it('should indicate the adapter being configured', async () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const rendered = render(store, <TestComponent />);

  await rendered.waitUntilReady();

  expect(rendered.queryByText('Is configured: Yes')).toBeInTheDocument();
});
