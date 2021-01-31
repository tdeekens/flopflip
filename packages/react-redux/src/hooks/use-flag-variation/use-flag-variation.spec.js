import React from 'react';
import { Provider } from 'react-redux';
import useFlagVariation from './use-flag-variation';
import { screen, renderWithAdapter } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
import Configure from '../../components/configure';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

const TestComponent = () => {
  const variation = useFlagVariation('variation');

  return (
    <ul>
      <li>Variation: {variation}</li>
    </ul>
  );
};

it('should indicate a flag variation', async () => {
  const store = createStore({
    [STATE_SLICE]: {
      flags: {
        memory: {
          variation: 'A',
        },
      },
    },
  });
  const { waitUntilConfigured } = render(store, <TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText('Variation: A')).toBeInTheDocument();
});
