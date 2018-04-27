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
    expect(wrapper).toHaveState('appliedAdapterArgs', props.adapterArgs);
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

            return wrapper
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
          beforeEach(() => {
            return wrapper.instance().componentDidMount();
          });

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

        return wrapper.instance().componentDidMount();
      });

      it('should invoke `onFlagsStateChange` on `adapterArgs` with `defaultFlags`', () => {
        expect(props.adapterArgs.onFlagsStateChange).toHaveBeenCalledWith(
          props.defaultFlags
        );
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let wrapper;
    let props;
    let nextProps;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );
    });

    describe('with changed `adapterArgs`', () => {
      beforeEach(() => {
        nextProps = createTestProps({
          adapterArgs: {
            user: 'changed-user',
          },
        });

        jest.spyOn(wrapper.instance(), 'reconfigureOrQueue');

        wrapper.instance().componentWillReceiveProps(nextProps);
      });

      it('should invoke `recongiureOrQueue`', () => {
        expect(wrapper.instance().reconfigureOrQueue).toHaveBeenCalled();
      });

      it('should invoke `recongiureOrQueue` with the `nextProps.adapterArgs`', () => {
        expect(wrapper.instance().reconfigureOrQueue).toHaveBeenCalledWith(
          nextProps.adapterArgs,
          expect.any(Object)
        );
      });

      it('should invoke `recongiureOrQueue` with `shouldOverwrite`', () => {
        expect(wrapper.instance().reconfigureOrQueue).toHaveBeenCalledWith(
          expect.any(Object),
          { shouldOverwrite: true }
        );
      });
    });

    describe('without changed `adapterArgs`', () => {
      beforeEach(() => {
        jest.spyOn(wrapper.instance(), 'reconfigureOrQueue');

        wrapper.instance().componentWillReceiveProps(props);
      });

      it('should invoke not `recongiureOrQueue`', () => {
        expect(wrapper.instance().reconfigureOrQueue).not.toHaveBeenCalled();
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

            return wrapper
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

  describe('applyAdapterArgs', () => {
    describe('when configured', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);
        wrapper
          .instance()
          .applyAdapterArgs(nextAdapterArgs, { shouldOverwrite: false });
      });

      it('should update the `state` of `appliedAdapterArgs`', () => {
        expect(wrapper).toHaveState('appliedAdapterArgs', nextAdapterArgs);
      });

      describe('with `pendingAdapterArgs`', () => {
        const pendingAdapterArgs = {
          group: 'next-group',
        };

        beforeEach(() => {
          wrapper.instance().setPendingAdapterArgs({
            adapterArgs: pendingAdapterArgs,
            options: { shouldOverwrite: false },
          });
          wrapper
            .instance()
            .applyAdapterArgs(nextAdapterArgs, { shouldOverwrite: false });
        });

        it('should unset the `pendingAdapterArgs` to `null`', () => {
          expect(wrapper.instance().pendingAdapterArgs).toBeNull();
        });
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
    });

    describe('without `pendingAdapterArgs`', () => {
      beforeEach(() => {
        wrapper.instance().setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });
      });

      it('should set `pendingAdapterArgs` to `nextAdapterArgs', () => {
        expect(wrapper.instance().pendingAdapterArgs).toEqual(
          expect.objectContaining(nextAdapterArgs)
        );
      });
    });

    describe('with `pendingAdapterArgs`', () => {
      const nextNextAdapterArgs = {
        firstName: 'user-first-name',
      };
      beforeEach(() => {
        wrapper.instance().setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });
        wrapper.instance().setPendingAdapterArgs({
          adapterArgs: nextNextAdapterArgs,
          options: { shouldOverwrite: false },
        });
      });

      it('should set `pendingAdapterArgs` merged with `pendingAdapterArgs', () => {
        expect(wrapper.instance().pendingAdapterArgs).toEqual(
          expect.objectContaining(nextAdapterArgs)
        );

        expect(wrapper.instance().pendingAdapterArgs).toEqual(
          expect.objectContaining(nextNextAdapterArgs)
        );
      });
    });
  });

  describe('getAdapterArgsForConfiguration', () => {
    let adapterArgsForConfiguration;

    describe('with `pendingAdapterArgs`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        wrapper.instance().setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });

        adapterArgsForConfiguration = wrapper
          .instance()
          .getAdapterArgsForConfiguration();
      });

      it('should return the `pendingAdapterArgs`', () => {
        expect(adapterArgsForConfiguration).toEqual(
          expect.objectContaining(nextAdapterArgs)
        );
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

        adapterArgsForConfiguration = wrapper
          .instance()
          .getAdapterArgsForConfiguration();
      });

      it('should return `appliedAdapterArgs`', () => {
        expect(adapterArgsForConfiguration).toEqual(
          wrapper.state('appliedAdapterArgs')
        );
      });
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

        jest.spyOn(wrapper.instance(), 'applyAdapterArgs');

        wrapper.instance().setAdapterState(AdapterStates.CONFIGURED);

        wrapper
          .instance()
          .reconfigureOrQueue(nextAdapterArgs, { shouldOverwrite: false });
      });

      it('should invoke `applyAdapterArgs`', () => {
        expect(wrapper.instance().applyAdapterArgs).toHaveBeenCalled();
      });

      it('should invoke `applyAdapterArgs` with `nextAdapterArgs`', () => {
        expect(wrapper.instance().applyAdapterArgs).toHaveBeenCalledWith(
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
          .reconfigureOrQueue(nextAdapterArgs, { shouldOverwrite: false });
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
          expect.objectContaining({ options: { shouldOverwrite: false } })
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
    describe('when not `shouldOverwrite`', () => {
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
            options: { shouldOverwrite: false },
          })
        ).toEqual(expect.objectContaining(nextAdapterArgs));
      });

      it('should keep the previous properties', () => {
        expect(
          mergeAdapterArgs(previousAdapterArgs, {
            adapterArgs: nextAdapterArgs,
            options: { shouldOverwrite: false },
          })
        ).toEqual(expect.objectContaining(previousAdapterArgs));
      });
    });

    describe('when `shouldOverwrite`', () => {
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
            options: { shouldOverwrite: true },
          })
        ).toEqual(expect.objectContaining(nextAdapterArgs));
      });

      it('should not keep the previous properties', () => {
        expect(
          mergeAdapterArgs(previousAdapterArgs, {
            adapterArgs: nextAdapterArgs,
            options: { shouldOverwrite: true },
          })
        ).not.toEqual(expect.objectContaining(previousAdapterArgs));
      });
    });
  });
});
