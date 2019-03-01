import React from 'react';
import { render } from '@flopflip/test-utils';
import omitProps from './omit-props';

const Component = props => (
  <>
    {Object.entries(props).map(([key, value]) => (
      <div key={key} data-testid={key}>
        {String(value)}
      </div>
    ))}
  </>
);
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
      TestComponent = omitProps(['a', 'b'])(Component);
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
      TestComponent = omitProps()(Component);
    });

    it('should do nothing', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('a')).toBeInTheDocument();
      expect(queryByTestId('b')).toBeInTheDocument();
      expect(queryByTestId('c')).toBeInTheDocument();
    });
  });
});
