import React from 'react';
import { renderWithAdapter, PropsToComponent } from '@flopflip/test-utils';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    const TestComponent = injectFeatureToggle('disabledFeature')(
      PropsToComponent
    );

    it('should render receive the flag value is `false`', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('isFeatureEnabled')).toHaveTextContent('false');
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = injectFeatureToggle('enabledFeature')(
      PropsToComponent
    );

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
    )(PropsToComponent);

    it('should render receive the flag value is `false`', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('customPropKey')).toHaveTextContent('false');
    });
  });
});
