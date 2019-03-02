import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    const TestComponent = injectFeatureToggle('disabledFeature')(
      components.FlagsToComponent
    );

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const { queryByFlagName, waitUntilReady, changeFlagVariation } = render(
          <TestComponent />
        );

        await waitUntilReady();

        changeFlagVariation('disabledFeature', true);

        expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
      });
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = injectFeatureToggle('enabledFeature')(
      components.FlagsToComponent
    );

    it('should render receive the flag value as `true`', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    const TestComponent = injectFeatureToggle(
      'disabledFeature',
      'customPropKey'
    )(components.FlagsToComponent);

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('customPropKey')).toHaveTextContent('false');
    });
  });
});
