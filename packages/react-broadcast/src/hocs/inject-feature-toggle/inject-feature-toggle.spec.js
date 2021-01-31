import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../../components/configure';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    it('should render receive the flag value as `false`', async () => {
      const TestComponent = injectFeatureToggle('disabledFeature')(
        components.FlagsToComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');

      await waitUntilConfigured();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = injectFeatureToggle('disabledFeature')(
          components.FlagsToComponent
        );

        const {
          waitUntilConfigured,
          queryByFlagName,
          changeFlagVariation,
        } = render(<TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render receive the flag value as `true`', async () => {
      const TestComponent = injectFeatureToggle('enabledFeature')(
        components.FlagsToComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    it('should render receive the flag value as `false`', async () => {
      const TestComponent = injectFeatureToggle(
        'disabledFeature',
        'customPropKey'
      )(components.FlagsToComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('customPropKey')).toHaveTextContent('false');
    });
  });
});
