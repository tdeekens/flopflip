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
      const rendered = render(<TestComponent {...props} />);
      expect(rendered.queryByFlagName('a')).not.toBeInTheDocument();
      expect(rendered.queryByFlagName('b')).not.toBeInTheDocument();
    });

    it('should keep not omitted props', () => {
      const rendered = render(<TestComponent {...props} />);

      expect(rendered.queryByFlagName('c')).toBeInTheDocument();
    });
  });

  describe('without any props', () => {
    beforeEach(() => {
      TestComponent = omitProps()(components.FlagsToComponent);
    });

    it('should do nothing', () => {
      const rendered = render(<TestComponent {...props} />);

      expect(rendered.queryByFlagName('a')).toBeInTheDocument();
      expect(rendered.queryByFlagName('b')).toBeInTheDocument();
      expect(rendered.queryByFlagName('c')).toBeInTheDocument();
    });
  });
});
