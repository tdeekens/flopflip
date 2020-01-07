import React from 'react';
import { render, components } from '@flopflip/test-utils';
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
      TestComponent = withProps(enhancedProps)(components.FlagsToComponent);
    });

    it('should have base props', () => {
      const rendered = render(<TestComponent {...props} />);

      expect(rendered.queryByFlagName('a')).toBeInTheDocument();
    });

    it('should have enhanced props', () => {
      const rendered = render(<TestComponent {...props} />);

      expect(rendered.queryByFlagName('b')).toBeInTheDocument();
    });
  });

  describe('with `mapProps` being function', () => {
    const enhancedProps = {
      b: 'b',
    };
    beforeEach(() => {
      props = createTestProps();
      TestComponent = withProps(() => enhancedProps)(
        components.FlagsToComponent
      );
    });

    it('should have enhanced props', () => {
      const rendered = render(<TestComponent {...props} />);

      expect(rendered.queryByFlagName('a')).toBeInTheDocument();
    });
  });
});
