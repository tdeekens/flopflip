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
    it('should render receive the flag value as `false`', async () => {
      const TestComponent = injectFeatureToggle('disabledFeature')(
        components.FlagsToComponent
      );

      const rendered = render(<TestComponent />);

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
        'false'
      );

      await rendered.waitUntilReady();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = injectFeatureToggle('disabledFeature')(
          components.FlagsToComponent
        );

        const rendered = render(<TestComponent />);

        await rendered.waitUntilReady();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
          'true'
        );
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render receive the flag value as `true`', async () => {
      const TestComponent = injectFeatureToggle('enabledFeature')(
        components.FlagsToComponent
      );

      const rendered = render(<TestComponent />);

      await rendered.waitUntilReady();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
        'true'
      );
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
      const rendered = render(<TestComponent />);

      await rendered.waitUntilReady();

      expect(rendered.queryByFlagName('customPropKey')).toHaveTextContent(
        'false'
      );
    });
  });
});
