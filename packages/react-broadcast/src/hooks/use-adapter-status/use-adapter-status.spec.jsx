import { renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../../components/configure';
import useAdapterStatus from './';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
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
  const { waitUntilConfigured } = render(<TestComponent />);

  expect(screen.getByText(/Is configuring: Yes/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configured: No/i)).toBeInTheDocument();

  await waitUntilConfigured();
});

// eslint-disable-next-line jest/expect-expect
it('should indicate the adapter is configured', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  await screen.findByText(/Is configuring: No/i);
  await screen.findByText(/Is configured: Yes/i);
});
