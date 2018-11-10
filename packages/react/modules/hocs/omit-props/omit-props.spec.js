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
  let EnhancedComponent;
  let props;
  let wrapper;

  describe('with multiple props', () => {
    beforeEach(() => {
      EnhancedComponent = omitProps('a', 'b')(WrappedComponent);
      props = createTestProps();

      wrapper = shallow(<EnhancedComponent {...props} />);
    });

    it('should omit multiple props', () => {
      expect(wrapper.find(WrappedComponent)).toMatchSnapshot();
    });
  });

  describe('without any props', () => {
    beforeEach(() => {
      EnhancedComponent = omitProps()(WrappedComponent);
      wrapper = shallow(<EnhancedComponent {...props} />);
    });

    it('should do nothing', () => {
      expect(wrapper.find(WrappedComponent)).toMatchSnapshot();
    });
  });
});
