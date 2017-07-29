import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import withSubscription from './with-subscription';

const TestComponent = () => <div />;

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const Component = withSubscription('foo-prop-key')(TestComponent);
    wrapper = shallow(<Component />);
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render a `Subscriber`', () => {
    expect(wrapper).toRender('Subscriber');
  });

  it('should supply a `channel` to the `Subscriber`', () => {
    expect(wrapper.find('Subscriber').prop('channel')).toBeDefined();
  });
});
