import React from 'react';
import { render } from '@flopflip/test-utils';
import withProps from './with-props';

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

  ...custom,
});

describe('rendering', () => {
  let TestComponent;
  let props;

  describe('with `mapProps` being object', () => {
    const enhancedProps = {
      b: 'b',
    };
    beforeEach(() => {
      props = createTestProps();
      TestComponent = withProps(enhancedProps)(Component);
    });

    it('should have base props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('a')).toBeInTheDocument();
    });

    it('should have enhanced props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('b')).toBeInTheDocument();
    });
  });

  describe('with `mapProps` being function', () => {
    const enhancedProps = {
      b: 'b',
    };
    beforeEach(() => {
      props = createTestProps();
      TestComponent = withProps(() => enhancedProps)(Component);
    });

    it('should have enhanced props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('a')).toBeInTheDocument();
    });
  });
});
