import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
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
  const rendered = render(<TestComponent />);

  expect(rendered.queryByText(/Is configuring: Yes/i)).toBeInTheDocument();
  expect(rendered.queryByText(/Is configured: No/i)).toBeInTheDocument();

  await rendered.waitUntilConfigured();
});

it('should indicate the adapter is configured', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.queryByText(/Is configuring: No/i)).toBeInTheDocument();
  expect(rendered.queryByText(/Is configured: Yes/i)).toBeInTheDocument();
});
