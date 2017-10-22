import React from 'react';
import { shallow } from 'enzyme';
import FeatureToggled from './feature-toggled';

const UntoggledComponent = () => <div>{'UntoggledComponent'}</div>;
UntoggledComponent.displayName = 'UntoggledComponent';
const ToggledComponent = () => <div>{'ToggledComponent'}</div>;
ToggledComponent.displayName = 'ToggledComponent';
const FeatureComponent = () => <div>{'FeatureComponent'}</div>;
FeatureComponent.displayName = 'FeatureComponent';

describe('when feature disabled', () => {
  describe('with untoggled component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled
          isFeatureEnabled={false}
          untoggledComponent={UntoggledComponent}
        >
          <FeatureComponent />
        </FeatureToggled>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `UntoggledComponent`', () => {
      expect(wrapper).toRender(UntoggledComponent);
    });

    it('should not render the `FeatureComponent`', () => {
      expect(wrapper).not.toRender(FeatureComponent);
    });
  });

  describe('without untoggled component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled isFeatureEnabled={false}>
          <FeatureComponent />
        </FeatureToggled>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `FeatureComponent`', () => {
      expect(wrapper).not.toRender(FeatureComponent);
    });
  });
});

describe('when feature enabled', () => {
  let wrapper;

  describe('with `children`', () => {
    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled
          isFeatureEnabled
          untoggledComponent={UntoggledComponent}
        >
          <FeatureComponent />
        </FeatureToggled>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `UntoggledComponent`', () => {
      expect(wrapper).not.toRender(UntoggledComponent);
    });

    it('should render the `FeatureComponent`', () => {
      expect(wrapper).toRender(FeatureComponent);
    });
  });

  describe('with `toggledComponent`', () => {
    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled
          isFeatureEnabled
          untoggledComponent={UntoggledComponent}
          toggledComponent={FeatureComponent}
        />
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `UntoggledComponent`', () => {
      expect(wrapper).not.toRender(UntoggledComponent);
    });

    it('should render the `FeatureComponent`', () => {
      expect(wrapper).toRender(FeatureComponent);
    });
  });

  describe('with `render`', () => {
    let props;
    beforeEach(() => {
      props = {
        isFeatureEnabled: true,
        untoggledComponent: UntoggledComponent,
        render: jest.fn(() => <div>{'FeatureComponent'}</div>),
      };

      wrapper = shallow(<FeatureToggled {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should invoke `render`', () => {
      expect(props.render).toHaveBeenCalled();
    });

    it('should invoke `render` with `isFeatureEnabled`', () => {
      expect(props.render).toHaveBeenCalledWith({
        isFeatureEnabled: props.isFeatureEnabled,
      });
    });
  });
});
