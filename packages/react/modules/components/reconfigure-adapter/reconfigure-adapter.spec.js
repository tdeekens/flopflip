import React from 'react';
import { shallow } from 'enzyme';
import { ReconfigureAdapter } from './reconfigure-adapter';

const ChildComponent = () => <div />;
ChildComponent.displayName = 'ChildComponent';

const createTestProps = props => ({
  user: {
    key: 'foo-user-key',
  },
  exact: false,
  reconfigure: jest.fn(),
  children: ChildComponent,

  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <ReconfigureAdapter {...props}>
        <ChildComponent />
      </ReconfigureAdapter>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render `children`', () => {
    expect(wrapper).toRender('ChildComponent');
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;

  describe('componentDidMount', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <ReconfigureAdapter {...props}>
          <ChildComponent />
        </ReconfigureAdapter>
      );

      wrapper.instance().componentDidMount();
    });

    it('should invoke `reconfigure`', () => {
      expect(props.reconfigure).toHaveBeenCalled();
    });

    it('should invoke `reconfigure` with `user`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          user: props.user,
        }),
        expect.any(Object)
      );
    });

    it('should invoke `reconfigure` with `exact`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          exact: props.exact,
        })
      );
    });
  });
  describe('componentDidUpdate', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <ReconfigureAdapter {...props}>
          <ChildComponent />
        </ReconfigureAdapter>
      );

      props.reconfigure.mockClear();

      wrapper.instance().componentDidUpdate();
    });

    it('should invoke `reconfigure`', () => {
      expect(props.reconfigure).toHaveBeenCalled();
    });

    it('should invoke `reconfigure` with `user`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          user: props.user,
        }),
        expect.any(Object)
      );
    });

    it('should invoke `reconfigure` with `exact`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          exact: props.exact,
        })
      );
    });
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `exact` to `false`', () => {
      expect(ReconfigureAdapter.defaultProps.exact).toBe(false);
    });

    it('should default `children` to `null`', () => {
      expect(ReconfigureAdapter.defaultProps.children).toBe(null);
    });
  });
});
