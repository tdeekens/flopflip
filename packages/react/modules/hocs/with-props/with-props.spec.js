import React from 'react';
import { render, PropsToComponent } from '@flopflip/test-utils';
import withProps from './with-props';

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
      TestComponent = withProps(enhancedProps)(PropsToComponent);
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
      TestComponent = withProps(() => enhancedProps)(PropsToComponent);
    });

    it('should have enhanced props', () => {
      const { queryByTestId } = render(<TestComponent {...props} />);

      expect(queryByTestId('a')).toBeInTheDocument();
    });
  });
});
