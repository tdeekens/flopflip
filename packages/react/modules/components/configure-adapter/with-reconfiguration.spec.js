import React from 'react';
import { shallow } from 'enzyme';
import withReconfiguration from './with-reconfiguration';

const TestComponent = () => <div />;
TestComponent.displayName = 'TestComponent';

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const Component = withReconfiguration('foo-prop-key')(TestComponent);
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
    Component = withReconfiguration('foo-prop-key')(TestComponent);
  });

  it('should set the `displayName`', () => {
    expect(Component.displayName).toEqual('withReconfiguration(TestComponent)');
  });
});
