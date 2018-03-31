import React from 'react';
import { shallow } from 'enzyme';
import withFlags from './with-flags';

const TestComponent = () => <div />;

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const Component = withFlags('foo-prop-key')(TestComponent);
    wrapper = shallow(<Component />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `<FlagsContext.Consumer>`', () => {
    expect(wrapper).toRender('Consumer');
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
