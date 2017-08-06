import React from 'react';
import { shallow } from 'enzyme';
import branchUntoggled from './branch-untoggled';

const UntoggledComponent = () =>
  <div>
    {'UntoggledComponent'}
  </div>;
UntoggledComponent.displayName = 'UntoggledComponent';
const FeatureComponent = () =>
  <div>
    {'FeatureComponent'}
  </div>;
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
        expect(wrapper).toHaveText('FeatureComponent');
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
        expect(wrapper).not.toRender('UntoggledComponent');
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toHaveText('FeatureComponent');
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
        expect(wrapper).toHaveText('UntoggledComponent');
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
        expect(wrapper).toHaveText('FeatureComponent');
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
        expect(wrapper).not.toRender('UntoggledComponent');
      });

      it('should render the `FeatureComponent`', () => {
        expect(wrapper).toHaveText('FeatureComponent');
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
        expect(wrapper).toHaveText('UntoggledComponent');
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
});
