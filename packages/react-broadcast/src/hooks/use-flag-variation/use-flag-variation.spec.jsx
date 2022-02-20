import { renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../../components/configure';
import useFlagVariation from './use-flag-variation';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
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
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText('Variation: A')).toBeInTheDocument();
});
