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
  const InjectedComponent = injectFeatureToggle('flag1')(FeatureComponent);
  let props;
  let wrapper;

  let Container;
  describe('when feature is disabled', () => {
    beforeEach(() => {
      props = createTestProps();
      Container = () => <InjectedComponent />;
      wrapper = mount(
        <Configure {...props} adapter={memoryAdapter}>
          <Container />
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
  const InjectedComponent = injectFeatureToggle('flag1', 'fooBar')(
    FeatureComponent
  );
  let props;
  let wrapper;

  let Container;
  beforeEach(() => {
    props = createTestProps();
    Container = () => <InjectedComponent />;
    wrapper = mount(
      <Configure {...props} adapter={memoryAdapter}>
        <Container />
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
