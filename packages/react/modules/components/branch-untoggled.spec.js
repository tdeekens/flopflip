import React from 'react';
import { shallow } from 'enzyme';
import branchUntoggled from './branch-untoggled';

const UntoggledComponent = () => <div>{'UntoggledComponent'}</div>;
UntoggledComponent.displayName = 'UntoggledComponent';
// This is a shortcut for test expectations on the display name as recompose
// wraps it for us.
UntoggledComponent.wrappedDisplayName = 'renderComponent(UntoggledComponent)';
const FeatureComponent = () => <div>{'FeatureComponent'}</div>;
FeatureComponent.displayName = 'FeatureComponent';

describe('with `flagName`', () => {
  const flagName = 'fooFlagName';

  describe('when feature is enabled', () => {
    const featureFlag = { [flagName]: true };

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled(undefined, flagName)(FeatureComponent);
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
        Component = branchUntoggled(UntoggledComponent, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.wrappedDisplayName);
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
        Component = branchUntoggled(UntoggledComponent, flagName)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.wrappedDisplayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled(undefined, flagName)(FeatureComponent);
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `Nothing`', () => {
        expect(wrapper).toRender('Nothing');
      });
    });
  });
});

describe('with `flagName` and `flagVariate`', () => {
  const flagName = 'fooFlagName';
  const flagVariate = 'fooflagVariate';

  describe('when feature is enabled', () => {
    const featureFlag = { [flagName]: flagVariate };

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled(undefined, flagName, flagVariate)(
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
        Component = branchUntoggled(UntoggledComponent, flagName, flagVariate)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.wrappedDisplayName);
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });
  });

  describe('when feature is disabled', () => {
    const featureFlag = { [flagName]: 'flagVariate2' };

    describe('with untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled(UntoggledComponent, flagName, flagVariate)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.wrappedDisplayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled(undefined, flagName, flagVariate)(
          FeatureComponent
        );
        wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `Nothing`', () => {
        expect(wrapper).toRender('Nothing');
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
        Component = branchUntoggled()(FeatureComponent);
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
        Component = branchUntoggled(UntoggledComponent)(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `UntoggledComponent`', () => {
        expect(wrapper).not.toRender(UntoggledComponent.wrappedDisplayName);
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
        Component = branchUntoggled(UntoggledComponent)(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `UntoggledComponent`', () => {
        expect(wrapper).toRender(UntoggledComponent.wrappedDisplayName);
      });
    });

    describe('without untoggled component', () => {
      let Component;
      let wrapper;

      beforeEach(() => {
        Component = branchUntoggled()(FeatureComponent);
        wrapper = shallow(<Component {...featureFlag} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `Nothing`', () => {
        expect(wrapper).toRender('Nothing');
      });
    });
  });

  describe('with default variate value', () => {
    const flagName = 'fooTestFlag';
    const flagVariate = 'fooTestVariate';

    describe('when flag is not defined', () => {
      const featureFlag = {};
      describe('with flag variate and matching default', () => {
        const flagVariateDefaultValue = flagVariate;

        let Component;
        let wrapper;

        beforeEach(() => {
          Component = branchUntoggled(
            undefined,
            flagName,
            flagVariate,
            flagVariateDefaultValue
          )(FeatureComponent);
          wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
        });

        it('should match snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });

        it('should render the `FeatureComponent`', () => {
          expect(wrapper).toRender(FeatureComponent);
        });
      });

      describe('with flag variate and non matching default', () => {
        const flagVariateDefaultValue = `${flagVariate}2`;

        let Component;
        let wrapper;

        beforeEach(() => {
          Component = branchUntoggled(
            undefined,
            flagName,
            flagVariate,
            flagVariateDefaultValue
          )(FeatureComponent);
          wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
        });

        it('should match snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });

        it('should render the `Nothing`', () => {
          expect(wrapper).toRender('Nothing');
        });
      });
    });

    describe('when flag is defined', () => {
      const featureFlag = { [flagName]: flagVariate };

      describe('with flag variate and matching default', () => {
        const flagVariateDefaultValue = flagVariate;

        let Component;
        let wrapper;

        beforeEach(() => {
          Component = branchUntoggled(
            undefined,
            flagName,
            flagVariate,
            flagVariateDefaultValue
          )(FeatureComponent);
          wrapper = shallow(<Component flagName={flagName} {...featureFlag} />);
        });

        it('should match snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });

        it('should render the `FeatureComponent`', () => {
          expect(wrapper).toRender(FeatureComponent);
        });
      });
    });
  });
});
