import React from 'react';
import { screen, renderWithAdapter } from '@flopflip/test-utils';
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
  const { isConfiguring, isConfigured } = useAdapterStatus();

  return (
    <ul>
      <li>Is configuring: {isConfiguring ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
    </ul>
  );
};

it('should indicate the adapter not configured yet', async () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const { waitUntilConfigured } = render(store, <TestComponent />);

  expect(screen.getByText(/Is configured: No/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configuring: Yes/i)).toBeInTheDocument();

  await waitUntilConfigured();
});

it('should indicate the adapter is configured and not configuring any longer', async () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const { waitUntilConfigured } = render(store, <TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText(/Is configured: Yes/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configuring: No/i)).toBeInTheDocument();
});
