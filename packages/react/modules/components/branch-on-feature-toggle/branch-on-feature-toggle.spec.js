import React from 'react';
import { render, components } from '@flopflip/test-utils';
import branchOnFeatureToggle from './branch-on-feature-toggle';

describe('with `flagName`', () => {
  const flagName = 'fooFlagName';

  describe('when feature is enabled', () => {
    const featureFlags = { [flagName]: true };

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          components.ToggledComponent
        );
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          components.UntoggledComponent,
          flagName
        )(components.ToggledComponent);
      });

      it('should not render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });
  });
  describe('when feature is disabled', () => {
    const featureFlags = { [flagName]: false };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          components.UntoggledComponent,
          flagName
        )(components.ToggledComponent);
      });

      it('should render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );
        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          components.ToggledComponent
        );
      });

      it('should render neither the component representing an disabled or enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toBeInTheDocument();
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
          components.ToggledComponent
        );
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          components.UntoggledComponent,
          flagName,
          flagVariation
        )(components.ToggledComponent);
      });

      it('should not render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });
  });

  describe('when feature is disabled', () => {
    const featureFlags = { [flagName]: 'flagVariation2' };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          components.UntoggledComponent,
          flagName,
          flagVariation
        )(components.ToggledComponent);
      });

      it('should render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName, flagVariation)(
          components.ToggledComponent
        );
      });

      it('should render neither the component representing an disabled or enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toBeInTheDocument();
      });
    });
  });
});

describe('without `flagName`', () => {
  describe('when feature is enabled', () => {
    const flagName = 'isFeatureEnabled';
    const featureFlags = { [flagName]: true };

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(components.ToggledComponent);
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(components.UntoggledComponent)(
          components.ToggledComponent
        );
      });

      it('should not render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });

      it('should render the component representing an enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });
  });
  describe('when feature is disabled', () => {
    const flagName = 'isFeatureEnabled';
    const featureFlags = { [flagName]: false };

    describe('with untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle(components.UntoggledComponent)(
          components.ToggledComponent
        );
      });

      it('should render the component representing an disabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });
    });

    describe('without untoggled component', () => {
      let Component;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(components.ToggledComponent);
      });

      it('should render neither the component representing an disabled or enabled feature', () => {
        const { queryByFlagName } = render(
          <Component flagName={flagName} {...featureFlags} />
        );

        expect(queryByFlagName(flagName)).not.toBeInTheDocument();
      });
    });
  });
});
