import { act, renderWithAdapter, screen } from '@flopflip/test-utils';
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

it('should indicate the adapter is configured', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  // UI is tearing. If this test is run in isolation we have "Is configuring: Yes"
  expect(screen.getByText(/Is configuring: No/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configured: No/i)).toBeInTheDocument();

  // Need 2 (only 1 if we only run this suite) more microtask to get UI into a consistent state.
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });

  expect(screen.getByText(/Is configuring: No/i)).toBeInTheDocument();
  expect(screen.getByText(/Is configured: Yes/i)).toBeInTheDocument();
});
