import React from 'react';
import { render, components } from '@flopflip/test-utils';
import omitProps from './omit-props';

const createTestProps = (custom = {}) => ({
  a: 1,
  b: 2,
  c: 3,

  ...custom,
});

describe('rendering', () => {
  let TestComponent;
  let props;

  describe('with multiple props', () => {
    beforeEach(() => {
      TestComponent = omitProps(['a', 'b'])(components.FlagsToComponent);
      props = createTestProps();
    });

    it('should omit multiple props', () => {
      const { queryByFlagName } = render(<TestComponent {...props} />);
      expect(queryByFlagName('a')).not.toBeInTheDocument();
      expect(queryByFlagName('b')).not.toBeInTheDocument();
    });

    it('should keep not omitted props', () => {
      const { queryByFlagName } = render(<TestComponent {...props} />);

      expect(queryByFlagName('c')).toBeInTheDocument();
    });
  });

  describe('without any props', () => {
    beforeEach(() => {
      TestComponent = omitProps()(components.FlagsToComponent);
    });

    it('should do nothing', () => {
      const { queryByFlagName } = render(<TestComponent {...props} />);

      expect(queryByFlagName('a')).toBeInTheDocument();
      expect(queryByFlagName('b')).toBeInTheDocument();
      expect(queryByFlagName('c')).toBeInTheDocument();
    });
  });
});
