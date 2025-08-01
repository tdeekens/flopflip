import { components, renderWithAdapter } from '@flopflip/test-utils';
import { describe, expect, it } from 'vitest';

import { branchOnFeatureToggle } from '../src/branch-on-feature-toggle';
import { Configure } from '../src/configure';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    it('should render neither the component representing an disabled or enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle({ flag: 'disabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = branchOnFeatureToggle({
          flag: 'disabledFeature',
        })(components.ToggledComponent);

        const { waitUntilConfigured, getByFlagName, changeFlagVariation } =
          render(<TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(getByFlagName('isFeatureEnabled')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing an enabled feature', async () => {
      const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
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

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should render the component representing a disabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'disabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
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

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should not render the component representing a disabled feature', async () => {
      const TestComponent = branchOnFeatureToggle(
        { flag: 'enabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });
});
