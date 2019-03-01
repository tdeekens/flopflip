import React from 'react';
import { render } from '@flopflip/test-utils';
import withReconfiguration from './with-reconfiguration';

const Component = () => <div>Child component</div>;
Component.displayName = 'TestComponent';

describe('rendering', () => {
  let TestComponent;

  beforeEach(() => {
    TestComponent = withReconfiguration('foo-prop-key')(Component);
  });

  it('should render children', () => {
    const { queryByText } = render(<TestComponent />);

    expect(queryByText('Child component')).toBeInTheDocument();
  });
});

describe('statics', () => {
  let TestComponent;

  beforeEach(() => {
    TestComponent = withReconfiguration('foo-prop-key')(Component);
  });

  it('should set the `displayName`', () => {
    expect(TestComponent.displayName).toEqual(
      'withReconfiguration(TestComponent)'
    );
  });
});
