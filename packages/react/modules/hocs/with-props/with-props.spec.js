import React from 'react';
import { mount } from 'enzyme';
import withProps from './with-props';

const BaseComponent = () => null;
const createTestProps = (custom = {}) => ({
  a: 1,

  ...custom,
});

describe('rendering', () => {
  let EnhancedComponent;
  let props;
  let wrapper;

  describe('with `mapProps` being object', () => {
    const enhancedProps = {
      b: 'b',
    };
    beforeEach(() => {
      props = createTestProps();
      EnhancedComponent = withProps(enhancedProps)(BaseComponent);
      wrapper = mount(<EnhancedComponent {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have base props', () => {
      expect(wrapper).toHaveProp('a', 1);
    });

    it('should have enhanced props', () => {
      expect(wrapper.find(BaseComponent)).toHaveProp('b', 'b');
    });
  });

  describe('with `mapProps` being function', () => {
    const enhancedProps = {
      b: 'b',
    };
    beforeEach(() => {
      props = createTestProps();
      EnhancedComponent = withProps(() => enhancedProps)(BaseComponent);
      wrapper = mount(<EnhancedComponent {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have enhanced props', () => {
      expect(wrapper.find(BaseComponent)).toHaveProp('b', 'b');
    });
  });
});
