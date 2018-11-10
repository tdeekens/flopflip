import React from 'react';
import { shallow } from 'enzyme';
import branchOnFeatureToggle from './branch-on-feature-toggle';

const UntoggledComponent = () => (
  <React.Fragment>UntoggledComponent</React.Fragment>
);
UntoggledComponent.displayName = 'UntoggledComponent';
const FeatureComponent = () => (
  <React.Fragment>FeatureComponent</React.Fragment>
);
FeatureComponent.displayName = 'FeatureComponent';

describe('with `flagName`', () => {
  const flagName = 'fooFlagName';

  describe('when feature is enabled', () => {
    const featureFlag = { [flagName]: true };

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.displayName);
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });
  });
  describe('when feature is disabled', () => {
    const featureFlag = { [flagName]: false };

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.displayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `DefaultUntoggledComponent`', () => {
        expect(wrapper).toRender('DefaultUntoggledComponent');
      });
    });
  });
});

describe('with `flagName` and `flagVariation`', () => {
  const flagName = 'fooFlagName';
  const flagVariation = 'fooflagVariation';

  describe('when feature is enabled', () => {
    const featureFlag = { [flagName]: flagVariation };

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName, flagVariation)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          UntoggledComponent,
          flagName,
          flagVariation
        )(FeatureComponent);
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.displayName);
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });
  });

  describe('when feature is disabled', () => {
    const featureFlag = { [flagName]: 'flagVariation2' };

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(
          UntoggledComponent,
          flagName,
          flagVariation
        )(FeatureComponent);
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.displayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(undefined, flagName, flagVariation)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `DefaultUntoggledComponent`', () => {
        expect(wrapper).toRender('DefaultUntoggledComponent');
      });
    });
  });
});

describe('without `flagName`', () => {
  describe('when feature is enabled', () => {
    const featureFlag = { isFeatureEnabled: true };

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent)(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.displayName);
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });
  });
  describe('when feature is disabled', () => {
    const featureFlag = { isFeatureEnabled: false };

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle(UntoggledComponent)(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.displayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchOnFeatureToggle()(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `DefaultUntoggledComponent`', () => {
        expect(wrapper).toRender('DefaultUntoggledComponent');
      });
    });
  });
});
