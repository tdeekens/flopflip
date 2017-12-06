import React from 'react';
import { shallow } from 'enzyme';
import FlagSubscription, { AdapterStates } from './flags-subscription';

const ChildComponent = () => <div />;
const createTestProps = props => ({
  adapterArgs: {
    clientSideId: 'foo-clientSideId',
    user: {
      key: 'foo-user-key',
    },
    onFlagsStateChange: jest.fn(),
    onStatusStateChange: jest.fn(),
  },
  adapter: {
    configure: jest.fn(() => Promise.resolve()),
    reconfigure: jest.fn(() => Promise.resolve()),
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

    describe('when `shouldDeferAdapterConfiguration` is `false`', () => {
      describe('when not initialized', () => {
        describe('while configuring adapter', () => {
          let wrapper;
          let props;

          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: {
                configure: jest.fn(() => Promise.reject()),
              },
            });
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );
          });

          beforeEach(() => {
            wrapper.instance().componentDidMount();
          });

          it('should set the state to configuring', () => {
            expect(wrapper).toHaveState(
              'adapterState',
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configured', () => {
          beforeEach(() => wrapper.instance().componentDidMount());

          it('should invoke `configure` on `adapter`', () => {
            expect(props.adapter.configure).toHaveBeenCalled();
          });

          it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
            expect(props.adapter.configure).toHaveBeenCalledWith(
              props.adapterArgs
            );
          });

          it('should set the state to configured', () => {
            expect(wrapper).toHaveState(
              'adapterState',
              AdapterStates.CONFIGURED
            );
          });
        });
      });
    });

    describe('when `shouldDeferAdapterConfiguration` is `true`', () => {
      beforeEach(() => {
        props = createTestProps({ shouldDeferAdapterConfiguration: true });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.setState({ adapterState: AdapterStates.CONFIGURED });

        return wrapper.instance().componentDidMount();
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
    describe('when `shouldDeferAdapterConfiguration` is `false`', () => {
      let props;
      let wrapper;

      describe('when not configured', () => {
        describe('while configuring adapter', () => {
          let wrapper;
          let props;

          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: {
                configure: jest.fn(() => Promise.reject()),
              },
            });
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );
          });

          beforeEach(() => {
            wrapper.instance().componentDidMount();
          });

          it('should set the state to configuring', () => {
            expect(wrapper).toHaveState(
              'adapterState',
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configured', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );

            return wrapper.instance().componentDidUpdate();
          });

          it('should invoke `configure` on `adapter`', () => {
            expect(props.adapter.configure).toHaveBeenCalled();
          });

          it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
            expect(props.adapter.configure).toHaveBeenCalledWith(
              props.adapterArgs
            );
          });

          it('should set the state configured', () => {
            expect(wrapper).toHaveState(
              'adapterState',
              AdapterStates.CONFIGURED
            );
          });
        });
      });

      describe('when already configured', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(
            <FlagSubscription {...props}>
              <ChildComponent />
            </FlagSubscription>
          );

          wrapper.setState({ adapterState: AdapterStates.CONFIGURED });

          // Comes from `componentDidMount`
          props.adapter.configure.mockClear();

          return wrapper.instance().componentDidUpdate();
        });

        it('should not invoke `configure` on `adapter` again', () => {
          expect(props.adapter.configure).not.toHaveBeenCalled();
        });

        describe('while reconfiguring', () => {
          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: {
                reconfigure: jest.fn(() => Promise.reject()),
              },
            });
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );

            wrapper.setState({ adapterState: AdapterStates.CONFIGURED });
          });

          beforeEach(() => {
            wrapper.instance().componentDidUpdate();
          });

          it('should set the state configuring', () => {
            expect(wrapper).toHaveState(
              'adapterState',
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when reconfiguring', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(
              <FlagSubscription {...props}>
                <ChildComponent />
              </FlagSubscription>
            );

            wrapper.setState({ adapterState: AdapterStates.CONFIGURED });

            return wrapper.instance().componentDidUpdate();
          });

          it('should invoke `reconfigure` on `adapter`', () => {
            expect(props.adapter.reconfigure).toHaveBeenCalled();
          });

          it('should invoke `reconfigure` on `adapter` with `adapterArgs`', () => {
            expect(props.adapter.reconfigure).toHaveBeenCalledWith(
              props.adapterArgs
            );
          });

          describe('when the adapter configured', () => {
            it('should set the state to configured', () => {
              expect(wrapper).toHaveState(
                'adapterState',
                AdapterStates.CONFIGURED
              );
            });
          });
        });
      });
    });

    describe('when `shouldDeferAdapterConfiguration` is `true`', () => {
      let props;
      let wrapper;

      beforeEach(() => {
        props = createTestProps({ shouldDeferAdapterConfiguration: true });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        return wrapper.instance().componentDidUpdate();
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
