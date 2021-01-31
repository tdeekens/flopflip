import React from 'react';
import { screen, renderWithAdapter } from '@flopflip/test-utils';
import useAdapterStatus from './';
import Configure from '../../components/configure';

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

it('should indicate the adapter is configured', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText(/Is configuring: No/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configured: Yes/i)).toBeInTheDocument();
});
