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

const store = createStore({
  [STATE_SLICE]: { flags: { disabledFeature: false } },
});

it('should indicate the adapter not being ready', () => {
  const { getByText } = render(store, <TestComponent />);

  expect(getByText('Is ready: No')).toBeInTheDocument();
});

it('should indicate the adapter being ready', async () => {
  const { getByText, waitUntilReady } = render(store, <TestComponent />);

  await waitUntilReady();

  expect(getByText('Is ready: Yes')).toBeInTheDocument();
});

it('should indicate the adapter being configured', async () => {
  const { getByText, waitUntilReady } = render(store, <TestComponent />);

  await waitUntilReady();

  expect(getByText('Is configured: Yes')).toBeInTheDocument();
});
