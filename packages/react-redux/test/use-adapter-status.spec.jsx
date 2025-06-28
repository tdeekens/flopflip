import { renderWithAdapter, screen } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { expect, it } from 'vitest';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { useAdapterStatus } from '../src/use-adapter-status';
import { createStore } from './test-utils';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

function TestComponent() {
  const { isConfiguring, isConfigured } = useAdapterStatus();

  return (
    <ul>
      <li>Is configuring: {isConfiguring ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
    </ul>
  );
}

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
