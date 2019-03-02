import React from 'react';
import { renderShallowly } from '@flopflip/test-utils';
import { FlagsContext } from '../flags-context';
import withFlags from './with-flags';

const TestComponent = () => <div />;

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const Component = withFlags('foo-prop-key')(TestComponent);
    wrapper = renderShallowly(<Component />);
  });

  it('should render a `<FlagsContext.Consumer>`', () => {
    expect(wrapper).toRender(FlagsContext.Consumer);
  });
});

describe('statics', () => {
  let Component;
  beforeEach(() => {
    Component = withFlags('foo-prop-key')(TestComponent);
  });

  it('should set the `displayName`', () => {
    expect(Component.displayName).toEqual('withFlags(TestComponent)');
  });
});
