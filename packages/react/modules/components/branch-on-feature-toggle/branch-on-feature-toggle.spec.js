import React from 'react';
import { render } from '@flopflip/test-utils';
import branchOnFeatureToggle from './branch-on-feature-toggle';

const UntoggledComponent = () => <>Feature is disabled</>;
UntoggledComponent.displayName = 'UntoggledComponent';
const FeatureComponent = () => <>Feature is enabled</>;
FeatureComponent.displayName = 'FeatureComponent';

describe('with `flagName`', () => {
  const flagName = 'fooFlagName';

  describe('when feature is enabled', () => {
    const featureFlags = { [flagName]: true };

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          FeatureComponent
        );
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent, flagName)(
          FeatureComponent
        );
      });

      it('should not render the `UntoggledComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabled')).not.toBeInTheDocument();
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });
  });
  describe('when feature is disabled', () => {
    const featureFlags = { [flagName]: false };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent, flagName)(
          FeatureComponent
        );
      });

      it('should render the `UntoggledComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabled')).toBeInTheDocument();
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          FeatureComponent
        );
      });

      it('should render neither the `UntoggledComponent` nor the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabled')).not.toBeInTheDocument();
        expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
      });
    });
  });
});

describe('with `flagName` and `flagVariation`', () => {
  const flagName = 'fooFlagName';
  const flagVariation = 'fooflagVariation';

  describe('when feature is enabled', () => {
    const featureFlags = { [flagName]: flagVariation };

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName, flagVariation)(
          FeatureComponent
        );
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          UntoggledComponent,
          flagName,
          flagVariation
        )(FeatureComponent);
      });

      it('should not render the `UntoggledComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabbled')).not.toBeInTheDocument();
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is disabled', () => {
    const featureFlags = { [flagName]: 'flagVariation2' };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          UntoggledComponent,
          flagName,
          flagVariation
        )(FeatureComponent);
      });

      it('should render the `UntoggledComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabled')).toBeInTheDocument();
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName, flagVariation)(
          FeatureComponent
        );
      });

      it('should render neither the `UntoggledComponent` nor the `FeatureComponent`', () => {
        const { queryByText } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByText('Feature is disabled')).not.toBeInTheDocument();
        expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
      });
    });
  });
});

describe('without `flagName`', () => {
  describe('when feature is enabled', () => {
    const featureFlags = { isFeatureEnabled: true };

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(FeatureComponent);
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(<Component {...featureFlags} />);

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent)(FeatureComponent);
      });

      it('should not render the `UntoggledComponent`', () => {
        const { queryByText } = render(<Component {...featureFlags} />);

        expect(queryByText('Feature is disabled')).not.toBeInTheDocument();
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(<Component {...featureFlags} />);

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });
  });
  describe('when feature is disabled', () => {
    const featureFlags = { isFeatureEnabled: false };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent)(FeatureComponent);
      });

      it('should render the `UntoggledComponent`', () => {
        const { queryByText } = render(<Component {...featureFlags} />);

        expect(queryByText('Feature is disabled')).toBeInTheDocument();
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(FeatureComponent);
      });

      it('should render `DefaultUntoggledComponent`', () => {
        const { queryByText } = render(<Component {...featureFlags} />);

        expect(queryByText('Feature is disabled')).not.toBeInTheDocument();
        expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
      });
    });
  });
});
