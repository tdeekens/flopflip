import React from 'react';
import useFlagVariation from './use-flag-variation';
import { renderWithAdapter } from '@flopflip/test-utils';
import Configure from '../../components/configure';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
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
  const rendered = render(<TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.getByText('Variation: A')).toBeInTheDocument();
});
