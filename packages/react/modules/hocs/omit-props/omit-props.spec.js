import React from 'react';
import { shallow } from 'enzyme';

import omitProps from './omit-props';

const WrappedComponent = () => null;
const createTestProps = (custom = {}) => ({
  a: 1,
  b: 2,
  c: 3,

  ...custom,
});

describe('rendering', () => {
  let EnhancedTarget;
  let props;
  let wrapper;

  describe('with multiple props', () => {
    beforeEach(() => {
      EnhancedTarget = omitProps('a', 'b')(WrappedComponent);
      props = createTestProps();
      wrapper = shallow(<EnhancedTarget {...props} />);
    });

    it('should omit multiple props', () => {
      expect(wrapper.find(WrappedComponent)).toMatchSnapshot();
    });
  });

  describe('without any props', () => {
    beforeEach(() => {
      EnhancedTarget = omitProps()(WrappedComponent);
      wrapper = shallow(<EnhancedTarget {...props} />);
    });

    it('should do nothing', () => {
      expect(wrapper.find(WrappedComponent)).toMatchSnapshot();
    });
  });
});
