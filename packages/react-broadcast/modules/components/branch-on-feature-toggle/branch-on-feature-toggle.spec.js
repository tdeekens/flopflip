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
    const TestComponent = branchOnFeatureToggle({ flag: 'disabledFeature' })(
      components.ToggledComponent
    );

    it('should render neither the component representing an disabled or enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toBeInTheDocument();
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
      components.ToggledComponent
    );

    it('should render the component representing an enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});

describe('with `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    const TestComponent = branchOnFeatureToggle(
      { flag: 'disabledFeature' },
      components.UntoggledComponent
    )(components.ToggledComponent);

    it('should not render the component representing a enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should render the component representing a disabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = branchOnFeatureToggle(
      { flag: 'enabledFeature' },
      components.UntoggledComponent
    )(components.ToggledComponent);

    it('should render the component representing a enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should not render the component representing a disabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });
});
