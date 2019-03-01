import React from 'react';
import { render, PropsToComponent } from '@flopflip/test-utils';
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
      TestComponent = omitProps(['a', 'b'])(PropsToComponent);
      props = createTestProps();
    });

    it('should omit multiple props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);
      expect(queryByTestId('a')).not.toBeInTheDocument();
      expect(queryByTestId('b')).not.toBeInTheDocument();
    });

    it('should keep not omitted props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('c')).toBeInTheDocument();
    });
  });

  describe('without any props', () => {
    beforeEach(() => {
      TestComponent = omitProps()(PropsToComponent);
    });

    it('should do nothing', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('a')).toBeInTheDocument();
      expect(queryByTestId('b')).toBeInTheDocument();
      expect(queryByTestId('c')).toBeInTheDocument();
    });
  });
});
