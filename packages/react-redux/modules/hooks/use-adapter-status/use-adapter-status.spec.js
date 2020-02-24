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

  const rendered = render(store, <TestComponent />);

  expect(rendered.queryByText(/Is configured: No/i)).toBeInTheDocument();
  expect(rendered.queryByText(/Is configuring: Yes/i)).toBeInTheDocument();

  await rendered.waitUntilConfigured();
});

it('should indicate the adapter is configured and not configuring any longer', async () => {
  const store = createStore({
    [STATE_SLICE]: { flags: { disabledFeature: false } },
  });

  const rendered = render(store, <TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.queryByText(/Is configured: Yes/i)).toBeInTheDocument();
  expect(rendered.queryByText(/Is configuring: No/i)).toBeInTheDocument();
});
