import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import useAdapterStatus from './use-adapter-status';
import Configure from '../../components/configure';

jest.mock('tiny-warning');

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

describe('when React hooks (`useContext`) is available', () => {
  it('should indicate the adapter not being ready', async () => {
    const { getByText } = render(<TestComponent />);

    expect(getByText('Is ready: No')).toBeInTheDocument();
  });

  it('should indicate the adapter being ready', async () => {
    const { getByText, waitUntilReady } = render(<TestComponent />);

    await waitUntilReady();

    expect(getByText('Is ready: Yes')).toBeInTheDocument();
  });

  it('should indicate the adapter being configured', async () => {
    const { getByText, waitUntilReady } = render(<TestComponent />);

    await waitUntilReady();

    expect(getByText('Is configured: Yes')).toBeInTheDocument();
  });
});

describe('when React hooks (`useContext`) are not available', () => {
  describe('when flag is enabled', () => {
    beforeEach(() => {
      React.useContext = jest.fn(() => undefined);
    });

    it('should throw', () => {
      expect(() => useAdapterStatus()).toThrow();
    });
  });
});
