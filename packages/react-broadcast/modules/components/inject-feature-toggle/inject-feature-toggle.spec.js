import React from 'react';
import { mount } from 'enzyme';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';
import memoryAdapter, { updateFlags } from '@flopflip/memory-adapter';

const FeatureComponent = () => <div />;
FeatureComponent.displayName = 'FeatureComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});

describe('without `propKey`', () => {
  const EnhancedComponent = injectFeatureToggle('flag1')(FeatureComponent);
  let props;
  let wrapper;

  describe('when feature is disabled', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = mount(
        <Configure {...props} adapter={memoryAdapter}>
          <EnhancedComponent />
        </Configure>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have feature disabling prop', () => {
      expect(wrapper.find(FeatureComponent)).toHaveProp(
        'isFeatureEnabled',
        false
      );
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        updateFlags({ flag1: true });
        wrapper.update();
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should have feature enabling prop', () => {
        expect(wrapper.find(FeatureComponent)).toHaveProp(
          'isFeatureEnabled',
          true
        );
      });
    });
  });
});

describe('with `propKey`', () => {
  const EnhancedComponent = injectFeatureToggle('flag1', 'fooBar')(
    FeatureComponent
  );
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = mount(
      <Configure {...props} adapter={memoryAdapter}>
        <EnhancedComponent />
      </Configure>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have feature disabling `propKey`', () => {
    expect(wrapper.find(FeatureComponent)).toHaveProp('fooBar', false);
  });
});
