import React from 'react';
import { shallow } from 'enzyme';
import FlagSubscription from './flags-subscription';

const ChildComponent = () => <div />;
const createTestProps = props => ({
  shouldConfigure: true,
  shouldReconfigure: false,
  adapterArgs: {
    clientSideId: 'foo-clientSideId',
    user: {
      key: 'foo-user-key',
    },
    onFlagsStateChange: jest.fn(),
    onStatusStateChange: jest.fn(),
  },
  adapter: {
    configure: jest.fn(),
    reconfigure: jest.fn(),
    isReady: jest.fn(() => true),
    isConfigured: jest.fn(() => false),
  },
  children: ChildComponent,

  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <FlagSubscription {...props}>
        <ChildComponent />
      </FlagSubscription>
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
  describe('componentDidMount', () => {
    let wrapper;
    let props;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <FlagSubscription {...props}>
          <ChildComponent />
        </FlagSubscription>
      );
    });

    describe('when `shouldConfigure` is `true`', () => {
      describe('when not initialized', () => {
        beforeEach(() => {
          wrapper.instance().componentDidMount();
        });

        it('should invoke `configure` on `adapter`', () => {
          expect(props.adapter.configure).toHaveBeenCalled();
        });

        it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
          expect(props.adapter.configure).toHaveBeenCalledWith(
            props.adapterArgs
          );
        });
      });
    });

    describe('when `shouldConfigure` is `false`', () => {
      beforeEach(() => {
        props = createTestProps({ shouldConfigure: false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.instance().componentDidMount();
      });

      it('should not invoke `configure` on `adapter`', () => {
        expect(props.adapter.configure).not.toHaveBeenCalled();
      });
    });

    describe('with `defaultFlags`', () => {
      let wrapper;
      let props;

      beforeEach(() => {
        props = createTestProps({
          defaultFlags: {
            aFlag: true,
          },
        });

        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.instance().componentDidMount();
      });

      it('should invoke `onFlagsStateChange` on `adapterArgs` with `defaultFlags`', () => {
        expect(props.adapterArgs.onFlagsStateChange).toHaveBeenCalledWith(
          props.defaultFlags
        );
      });
    });
  });

  describe('componentDidUpdate', () => {
    describe('when `shouldConfigure` is `true`', () => {
      let props;
      let wrapper;

      describe('when not configured', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(
            <FlagSubscription {...props}>
              <ChildComponent />
            </FlagSubscription>
          );

          wrapper.instance().componentDidUpdate();
        });

        it('should invoke `configure` on `adapter`', () => {
          expect(props.adapter.configure).toHaveBeenCalled();
        });

        it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
          expect(props.adapter.configure).toHaveBeenCalledWith(
            props.adapterArgs
          );
        });
      });

      describe('when already configured', () => {
        beforeEach(() => {
          props = createTestProps({
            adapter: {
              configure: jest.fn(),
              reconfigure: jest.fn(),
              isReady: jest.fn(() => true),
              isConfigured: jest.fn(() => true),
            },
          });
          wrapper = shallow(
            <FlagSubscription {...props}>
              <ChildComponent />
            </FlagSubscription>
          );

          // Comes from `componentDidMount`
          props.adapter.configure.mockClear();

          wrapper.instance().componentDidUpdate();
        });

        it('should not invoke `configure` on `adapter` again', () => {
          expect(props.adapter.configure).not.toHaveBeenCalled();
        });

        describe('when `shouldReconfigure` is `true`', () => {
          beforeEach(() => {
            props = createTestProps({
              adapter: {
                configure: jest.fn(),
                reconfigure: jest.fn(),
                isReady: jest.fn(() => true),
                isConfigured: jest.fn(() => true),
                shouldReconfigure: true,
              },
            });
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );
            wrapper.instance().componentDidUpdate();
          });

          it('should invoke `reconfigure` on `adapter`', () => {
            expect(props.adapter.configure).toHaveBeenCalled();
          });

          it('should invoke `reconfigure` on `adapter` with `adapterArgs`', () => {
            expect(props.adapter.configure).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when `shouldConfigure` is `false`', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps({ shouldConfigure: false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.instance().componentDidUpdate();
      });

      it('should not invoke `configure` on `adapter`', () => {
        expect(props.adapter.configure).not.toHaveBeenCalled();
      });
    });
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `defaultFlags` to an empty object', () => {
      expect(FlagSubscription.defaultProps.defaultFlags).toEqual({});
    });
  });
});
