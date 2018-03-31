import React from 'react';
import { shallow } from 'enzyme';
import ConfigureAdapter, {
  AdapterStates,
  mergeAdapterArgs,
} from './configure-adapter';

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
      <ConfigureAdapter {...props}>
        <ChildComponent />
      </ConfigureAdapter>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render `children`', () => {
    expect(wrapper).toRender('ChildComponent');
  });

  it('should store `adapterArgs` onto `state`', () => {
    expect(wrapper).toHaveState('adapterArgs', props.adapterArgs);
  });
});

describe('lifecycle', () => {
  describe('componentDidMount', () => {
    let wrapper;
    let props;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
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
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );
          });

          beforeEach(() => {
            wrapper
              .instance()
              .componentDidMount()
              .catch(() => {});
          });

          it('should set the state to configuring', () => {
            expect(wrapper.instance().adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configures', () => {
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
            expect(wrapper.instance().adapterState).toEqual(
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
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);

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
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
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
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );
          });

          beforeEach(() => {
            wrapper
              .instance()
              .componentDidMount()
              .catch(() => {});
          });

          it('should set the state to configuring', () => {
            expect(wrapper.instance().adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configured', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
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
            expect(wrapper.instance().adapterState).toEqual(
              AdapterStates.CONFIGURED
            );
          });
        });
      });

      describe('when already configured', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(
            <ConfigureAdapter {...props}>
              <ChildComponent />
            </ConfigureAdapter>
          );

          wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);

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
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);
          });

          beforeEach(() => {
            wrapper
              .instance()
              .componentDidUpdate()
              .catch(() => {});
          });

          it('should set the state configuring', () => {
            expect(wrapper.instance().adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when reconfiguring', () => {
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);

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
              expect(wrapper.instance().adapterState).toEqual(
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
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        return wrapper.instance().componentDidUpdate();
      });

      it('should not invoke `configure` on `adapter`', () => {
        expect(props.adapter.configure).not.toHaveBeenCalled();
      });
    });
  });
});

describe('interacting', () => {
  let props;
  let wrapper;
  const nextAdapterArgs = {
    user: 'next-user',
  };

  describe('setAdapterArgs', () => {
    describe('when configured', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);
        wrapper.instance().setAdapterArgs(nextAdapterArgs, { exact: false });
      });

      it('should update the `state` of `adapterArgs`', () => {
        expect(wrapper).toHaveState('adapterArgs', nextAdapterArgs);
      });
    });
  });

  describe('setPendingAdapterArgs', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );

      wrapper.instance().setPendingAdapterArgs({
        adapterArgs: nextAdapterArgs,
        options: { exact: false },
      });
    });

    it('should set `pendingAdapterArgs`', () => {
      expect(wrapper.instance().pendingAdapterArgs).toEqual(
        expect.objectContaining(nextAdapterArgs)
      );
    });
  });

  describe('unsetPendingAdapterArgs', () => {
    describe('with `pendingAdapterArgs`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        jest.spyOn(wrapper.instance(), 'setAdapterArgs');

        wrapper.instance().setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { exact: false },
        });

        wrapper.instance().unsetPendingAdapterArgs();
      });

      it('should invoke `setAdapterArgs`', () => {
        expect(wrapper.instance().setAdapterArgs).toHaveBeenCalled();
      });

      it('should invoke `setAdapterArgs` with `pendingAdapterArgs`', () => {
        expect(wrapper.instance().setAdapterArgs).toHaveBeenCalledWith(
          expect.objectContaining(nextAdapterArgs)
        );
      });

      it('should unset `pendingAdapterArgs`', () => {
        expect(wrapper.instance().pendingAdapterArgs).toBeNull();
      });
    });

    describe('without `pendingReconfiguration`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        jest.spyOn(wrapper.instance(), 'setAdapterArgs');

        wrapper.instance().unsetPendingAdapterArgs();
      });

      it('should not invoke `setAdapterArgs`', () => {
        expect(wrapper.instance().setAdapterArgs).not.toHaveBeenCalled();
      });
    });

    describe('reconfigureOrQueue', () => {
      describe('when adapter is configured', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(
            <ConfigureAdapter {...props}>
              <ChildComponent />
            </ConfigureAdapter>
          );

          jest.spyOn(wrapper.instance(), 'setAdapterArgs');

          wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);

          wrapper
            .instance()
            .reconfigureOrQueue(nextAdapterArgs, { exact: false });
        });

        it('should invoke `setAdapterArgs`', () => {
          expect(wrapper.instance().setAdapterArgs).toHaveBeenCalled();
        });

        it('should invoke `setAdapterArgs` with `nextAdapterArgs`', () => {
          expect(wrapper.instance().setAdapterArgs).toHaveBeenCalledWith(
            expect.objectContaining(nextAdapterArgs)
          );
        });
      });

      describe('when adapter is configuring', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(
            <ConfigureAdapter {...props}>
              <ChildComponent />
            </ConfigureAdapter>
          );

          jest.spyOn(wrapper.instance(), 'setPendingAdapterArgs');

          wrapper.instance().setAdapterState(AdapterStates.CONFIGURING);

          wrapper
            .instance()
            .reconfigureOrQueue(nextAdapterArgs, { exact: false });
        });

        it('should invoke `setPendingAdapterArgs`', () => {
          expect(wrapper.instance().setPendingAdapterArgs).toHaveBeenCalled();
        });

        it('should invoke `setPendingAdapterArgs` with `nextAdapterArgs`', () => {
          expect(wrapper.instance().setPendingAdapterArgs).toHaveBeenCalledWith(
            expect.objectContaining({ adapterArgs: nextAdapterArgs })
          );
        });

        it('should invoke `setPendingAdapterArgs` with `options`', () => {
          expect(wrapper.instance().setPendingAdapterArgs).toHaveBeenCalledWith(
            expect.objectContaining({ options: { exact: false } })
          );
        });
      });
    });
  });

  describe('statics', () => {
    describe('defaultProps', () => {
      it('should default `defaultFlags` to an empty object', () => {
        expect(ConfigureAdapter.defaultProps.defaultFlags).toEqual({});
      });
    });
  });

  describe('helpers', () => {
    describe('mergeAdapterArgs', () => {
      describe('when not `exact`', () => {
        const previousAdapterArgs = {
          'some-prop': 'was-present',
        };
        const nextAdapterArgs = {
          'another-prop': 'is-added',
        };

        it('should merge the next properties', () => {
          expect(
            mergeAdapterArgs(previousAdapterArgs, {
              adapterArgs: nextAdapterArgs,
              options: { exact: false },
            })
          ).toEqual(expect.objectContaining(nextAdapterArgs));
        });

        it('should keep the previous properties', () => {
          expect(
            mergeAdapterArgs(previousAdapterArgs, {
              adapterArgs: nextAdapterArgs,
              options: { exact: false },
            })
          ).toEqual(expect.objectContaining(previousAdapterArgs));
        });
      });

      describe('when `exact`', () => {
        const previousAdapterArgs = {
          'some-prop': 'was-present',
        };
        const nextAdapterArgs = {
          'another-prop': 'is-added',
        };

        it('should merge the next properties', () => {
          expect(
            mergeAdapterArgs(previousAdapterArgs, {
              adapterArgs: nextAdapterArgs,
              options: { exact: true },
            })
          ).toEqual(expect.objectContaining(nextAdapterArgs));
        });

        it('should not keep the previous properties', () => {
          expect(
            mergeAdapterArgs(previousAdapterArgs, {
              adapterArgs: nextAdapterArgs,
              options: { exact: true },
            })
          ).not.toEqual(expect.objectContaining(previousAdapterArgs));
        });
      });
    });
  });
});
