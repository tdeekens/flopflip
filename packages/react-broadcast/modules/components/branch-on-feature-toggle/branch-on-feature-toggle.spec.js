import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import branchOnFeatureToggle from './branch-on-feature-toggle';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    it('should render neither the component representing an disabled or enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle({ flag: 'disabledFeature' })(
        components.ToggledComponent
      );

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(
        rendered.queryByFlagName('isFeatureEnabled')
      ).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = branchOnFeatureToggle({
          flag: 'disabledFeature',
        })(components.ToggledComponent);

        const rendered = render(<TestComponent />);

        await rendered.waitUntilConfigured();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(
          rendered.queryByFlagName('isFeatureEnabled')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing an enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
        components.ToggledComponent
      );

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});

describe('with `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    it('should not render the component representing a enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'disabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should render the component representing a disabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'disabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing a enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'enabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should not render the component representing a disabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'enabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });
});
