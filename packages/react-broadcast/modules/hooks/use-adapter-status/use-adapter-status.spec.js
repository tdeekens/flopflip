import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import useAdapterStatus from './';
import Configure from '../../components/configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

const TestComponent = () => {
  const { isReady, isConfigured } = useAdapterStatus();

  return (
    <ul>
      <li>Is ready: {isReady ? 'Yes' : 'No'}</li>
      <li>Is configured: {isConfigured ? 'Yes' : 'No'}</li>
    </ul>
  );
};

it('should indicate the adapter not being ready', () => {
  const rendered = render(<TestComponent />);

  expect(rendered.queryByText('Is ready: No')).toBeInTheDocument();
});

it('should indicate the adapter being ready', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilReady();

  expect(rendered.queryByText('Is ready: Yes')).toBeInTheDocument();
});

it('should indicate the adapter being configured', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilReady();

  expect(rendered.queryByText('Is configured: Yes')).toBeInTheDocument();
});
