import React from 'react';
import { shallow } from 'enzyme';
import withReconfigure from './with-reconfigure';

const TestComponent = () => <div />;
TestComponent.displayName = 'TestComponent';

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const Component = withReconfigure('foo-prop-key')(TestComponent);
    wrapper = shallow(<Component />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `<AdapterContext.Consumer>`', () => {
    expect(wrapper).toRender('Consumer');
  });
});

describe('statics', () => {
  let Component;

  beforeEach(() => {
    Component = withReconfigure('foo-prop-key')(TestComponent);
  });

  it('should set the `displayName`', () => {
    expect(Component.displayName).toEqual('withReconfigure(TestComponent)');
  });
});
