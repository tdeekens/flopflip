import { renderWithAdapter, screen } from '@flopflip/test-utils';
import { expect, it } from 'vitest';

import React from 'react';
import { Provider } from 'react-redux';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { useFlagVariation } from '../src/use-flag-variation';
import { createStore } from './test-utils';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

function TestComponent() {
  const variation = useFlagVariation('variation');

  return (
    <ul>
      <li>Variation: {variation}</li>
    </ul>
  );
}

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
