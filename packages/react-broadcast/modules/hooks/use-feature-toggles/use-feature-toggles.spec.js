import React from 'react';
import useFeatureToggles from './use-feature-toggles';
import { renderWithAdapter } from '@flopflip/test-utils';
import Configure from '../../components/configure';

jest.mock('tiny-warning');

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

const TestComponent = () => {
  const [
    isEnabledFeatureEnabled,
    isDisabledFeatureDisabled,
  ] = useFeatureToggles({
    enabledFeature: true,
    disabledFeature: true,
  });

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
    </ul>
  );
};

describe('when React hooks (`useContext`) is available', () => {
  it('should indicate a feature being disabled', async () => {
    const { getByText, waitUntilReady } = render(<TestComponent />);

    await waitUntilReady();

    expect(getByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const { getByText, waitUntilReady } = render(<TestComponent />);

    await waitUntilReady();

    expect(getByText('Is enabled: Yes')).toBeInTheDocument();
  });
});

describe('when React hooks (`useContext`) are not available', () => {
  describe('when flag is enabled', () => {
    beforeEach(() => {
      React.useContext = jest.fn(() => undefined);
    });

    it('should throw', () => {
      expect(() => useFeatureToggles('foo')).toThrow();
    });
  });
});
