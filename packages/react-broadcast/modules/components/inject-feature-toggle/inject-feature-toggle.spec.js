import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';

const Component = props => (
  <>
    {Object.entries(props).map(([key, value]) => (
      <div key={key} data-testid={key}>
        {String(value)}
      </div>
    ))}
  </>
);
const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    const TestComponent = injectFeatureToggle('disabledFeature')(Component);

    it('should render receive the flag value is `false`', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('isFeatureEnabled')).toHaveTextContent('false');
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = injectFeatureToggle('enabledFeature')(Component);

    it('should render receive the flag value is `true`', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('isFeatureEnabled')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    const TestComponent = injectFeatureToggle(
      'disabledFeature',
      'customPropKey'
    )(Component);

    it('should render receive the flag value is `false`', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('customPropKey')).toHaveTextContent('false');
    });
  });
});
