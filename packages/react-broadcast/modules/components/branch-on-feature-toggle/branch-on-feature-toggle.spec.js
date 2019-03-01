import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import branchOnFeatureToggle from './branch-on-feature-toggle';
import Configure from '../configure';

const ToggledComponent = () => <div>Feature is toggled</div>;
ToggledComponent.displayName = 'ToggledComponent';
const UntoggledComponent = () => <div>Feature is untoggled</div>;
UntoggledComponent.displayName = 'UntoggledComponent';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    const TestComponent = branchOnFeatureToggle({ flag: 'disabledFeature' })(
      ToggledComponent
    );

    it('should not render the `ToggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is toggled')).not.toBeInTheDocument();
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
      ToggledComponent
    );

    it('should render the `ToggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is toggled')).toBeInTheDocument();
    });
  });
});

describe('with `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    const TestComponent = branchOnFeatureToggle(
      { flag: 'disabledFeature' },
      UntoggledComponent
    )(ToggledComponent);

    it('should not render the `ToggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is toggled')).not.toBeInTheDocument();
    });

    it('should render the `UntoggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is untoggled')).toBeInTheDocument();
    });
  });

  describe('when feature is enabled', () => {
    const TestComponent = branchOnFeatureToggle(
      { flag: 'enabledFeature' },
      UntoggledComponent
    )(ToggledComponent);

    it('should render the `ToggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is toggled')).toBeInTheDocument();
    });

    it('should not render the `UntoggledComponent', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is untoggled')).not.toBeInTheDocument();
    });
  });
});
