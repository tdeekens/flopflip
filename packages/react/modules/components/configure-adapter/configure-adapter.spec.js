import React from 'react';
import { getComponentInstance, render } from '@flopflip/test-utils';
import ConfigureAdapter, {
  AdapterStates,
  mergeAdapterArgs,
} from './configure-adapter';

const ChildComponent = () => <div>Child component</div>;
ChildComponent.displayName = 'ChildComponent';

const createAdapter = custom => ({
  getIsReady: jest.fn(() => false),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),

  ...custom,
});

const createTestProps = props => ({
  adapterArgs: {
    clientSideId: 'foo-clientSideId',
    user: {
      key: 'foo-user-key',
    },
    onFlagsStateChange: jest.fn(),
    onStatusStateChange: jest.fn(),
  },
  adapter: createAdapter(),
  children: <ChildComponent />,

  ...props,
});

describe('rendering', () => {
  describe('when children are a node', () => {
    let props;
    beforeEach(() => {
      props = createTestProps();
    });

    it('should invoke `getIsReady` on `adapter`', () => {
      render(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );

      expect(props.adapter.getIsReady).toHaveBeenCalled();
    });

    it('should render `children`', () => {
      const { queryByText } = render(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );

      expect(queryByText('Child component')).toBeInTheDocument();
    });
  });

  describe('when `children` is a function', () => {
    let props;
    beforeEach(() => {
      props = createTestProps({
        children: jest.fn(() => <ChildComponent />),
      });
    });

    it('should invoke `getIsReady` on `adapter`', () => {
      render(<ConfigureAdapter {...props} />);

      expect(props.adapter.getIsReady).toHaveBeenCalled();
    });

    it('should invoke `children`', () => {
      render(<ConfigureAdapter {...props} />);

      expect(props.children).toHaveBeenCalledWith({
        isAdapterReady: false,
      });
    });

    it('should render `children`', () => {
      const { queryByText } = render(<ConfigureAdapter {...props} />);

      expect(queryByText('Child component')).toBeInTheDocument();
    });
  });

  describe('when `render` is a function', () => {
    let props;
    describe('when adapter is not ready', () => {
      beforeEach(() => {
        props = createTestProps({
          render: jest.fn(() => <ChildComponent />),
        });
      });

      it('should invoke `getIsReady` on `adapter`', () => {
        render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(props.adapter.getIsReady).toHaveBeenCalled();
      });

      it('should not not invoke `render`', () => {
        render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(props.render).not.toHaveBeenCalled();
      });
    });

    describe('when adapter is ready', () => {
      beforeEach(() => {
        props = createTestProps({
          render: jest.fn(() => <ChildComponent />),
          adapter: createAdapter({
            getIsReady: jest.fn(() => true),
          }),
        });
      });

      it('should invoke `getIsReady` on `adapter`', () => {
        render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(props.adapter.getIsReady).toHaveBeenCalled();
      });

      it('should invoke `render`', () => {
        render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(props.render).toHaveBeenCalled();
      });
    });
  });
});

describe('lifecycle', () => {
  describe('componentDidMount', () => {
    let componentInstance;
    let props;

    beforeEach(() => {
      props = createTestProps();
      componentInstance = getComponentInstance(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );
    });

    describe('when `shouldDeferAdapterConfiguration` is `false`', () => {
      describe('when not initialized', () => {
        describe('while configuring adapter', () => {
          let props;

          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: createAdapter({
                configure: jest.fn(() => Promise.reject()),
              }),
            });
            componentInstance = getComponentInstance(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            return componentInstance.componentDidMount().catch(() => {});
          });

          it('should set the state to configuring', () => {
            expect(componentInstance.adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configures', () => {
          beforeEach(() => {
            return componentInstance.componentDidMount();
          });

          it('should invoke `configure` on `adapter`', () => {
            expect(props.adapter.configure).toHaveBeenCalled();
          });

          it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
            expect(props.adapter.configure).toHaveBeenCalledWith(
              props.adapterArgs
            );
          });

          describe('when `children` is a function', () => {
            beforeEach(() => {
              props = createTestProps({
                children: jest.fn(() => <ChildComponent />),
              });
              componentInstance = getComponentInstance(
                <ConfigureAdapter {...props} />
              );

              return componentInstance.componentDidMount().catch(() => {});
            });

            it('should invoke `children` with not `isAdapterReady`', () => {
              expect(props.children).toHaveBeenCalledWith({
                isAdapterReady: false,
              });
            });
          });

          describe('when the adapter has configured', () => {
            beforeEach(() => {
              jest.spyOn(componentInstance, 'applyAdapterArgs');
            });

            describe('without pending adapter args', () => {
              it('should set the state to configured', () => {
                expect(componentInstance.adapterState).toEqual(
                  AdapterStates.CONFIGURED
                );
              });

              it('should not apply the `pendingAdapterArgs`', () => {
                expect(
                  componentInstance.applyAdapterArgs
                ).not.toHaveBeenCalled();
              });
            });

            describe('with `pendingAdapterArgs`', () => {
              beforeEach(() => {
                componentInstance.pendingAdapterArgs = {
                  custom: { pending: 'arg' },
                };

                return componentInstance.componentDidMount().catch(() => {});
              });

              it('should set the `adapterState` to configured', () => {
                expect(componentInstance.adapterState).toEqual(
                  AdapterStates.CONFIGURED
                );
              });

              it('should apply the `pendingAdapterArgs`', () => {
                expect(componentInstance.applyAdapterArgs).toHaveBeenCalled();
              });
            });
          });
        });
      });
    });

    describe('when `shouldDeferAdapterConfiguration` is `true`', () => {
      beforeEach(() => {
        props = createTestProps({ shouldDeferAdapterConfiguration: true });
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        componentInstance.setAdapterState(AdapterStates.CONFIGURED);

        return componentInstance.componentDidMount();
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

        wrapper = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        return wrapper.componentDidMount();
      });

      it('should invoke `onFlagsStateChange` on `adapterArgs` with `defaultFlags`', () => {
        expect(props.adapterArgs.onFlagsStateChange).toHaveBeenCalledWith(
          props.defaultFlags
        );
      });
    });
  });

  describe('UNSAFE_componentWillReceiveProps', () => {
    let componentInstance;
    let props;
    let nextProps;

    beforeEach(() => {
      props = createTestProps();
      componentInstance = getComponentInstance(
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

        jest.spyOn(componentInstance, 'reconfigureOrQueue');

        // eslint-disable-next-line new-cap
        componentInstance.UNSAFE_componentWillReceiveProps(nextProps);
      });

      it('should invoke `recongiureOrQueue`', () => {
        expect(componentInstance.reconfigureOrQueue).toHaveBeenCalled();
      });

      it('should invoke `recongiureOrQueue` with the `nextProps.adapterArgs`', () => {
        expect(componentInstance.reconfigureOrQueue).toHaveBeenCalledWith(
          nextProps.adapterArgs,
          expect.any(Object)
        );
      });

      it('should invoke `recongiureOrQueue` with `shouldOverwrite`', () => {
        expect(
          componentInstance.reconfigureOrQueue
        ).toHaveBeenCalledWith(expect.any(Object), { shouldOverwrite: false });
      });
    });

    describe('without changed `adapterArgs`', () => {
      beforeEach(() => {
        jest.spyOn(componentInstance, 'reconfigureOrQueue');

        // eslint-disable-next-line new-cap
        componentInstance.UNSAFE_componentWillReceiveProps(props);
      });

      it('should invoke not `recongiureOrQueue`', () => {
        expect(componentInstance.reconfigureOrQueue).not.toHaveBeenCalled();
      });
    });
  });

  describe('componentDidUpdate', () => {
    describe('when `shouldDeferAdapterConfiguration` is `false`', () => {
      let props;
      let componentInstance;

      describe('when not configured', () => {
        describe('while configuring adapter', () => {
          let componentInstance;
          let props;

          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: createAdapter({
                configure: jest.fn(() => Promise.reject()),
              }),
            });
            componentInstance = getComponentInstance(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );
          });

          beforeEach(() => {
            componentInstance.componentDidMount().catch(() => {});
          });

          it('should set the state to configuring', () => {
            expect(componentInstance.adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when the adapter configured', () => {
          beforeEach(() => {
            props = createTestProps();
            componentInstance = getComponentInstance(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            return componentInstance.componentDidUpdate();
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
            expect(componentInstance.adapterState).toEqual(
              AdapterStates.CONFIGURED
            );
          });
        });
      });

      describe('when already configured', () => {
        beforeEach(() => {
          props = createTestProps();
          componentInstance = getComponentInstance(
            <ConfigureAdapter {...props}>
              <ChildComponent />
            </ConfigureAdapter>
          );

          componentInstance.setAdapterState(AdapterStates.CONFIGURED);

          // Comes from `componentDidMount`
          props.adapter.configure.mockClear();

          return componentInstance.componentDidUpdate();
        });

        it('should not invoke `configure` on `adapter` again', () => {
          expect(props.adapter.configure).not.toHaveBeenCalled();
        });

        describe('while reconfiguring', () => {
          beforeEach(() => {
            props = createTestProps({
              // NOTE: Rejecting to not enter `then`.
              adapter: createAdapter({
                reconfigure: jest.fn(() => Promise.reject()),
              }),
            });
            componentInstance = getComponentInstance(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            componentInstance.setAdapterState(AdapterStates.CONFIGURED);

            return componentInstance.componentDidUpdate().catch(() => {});
          });

          it('should set the state configuring', () => {
            expect(componentInstance.adapterState).toEqual(
              AdapterStates.CONFIGURING
            );
          });
        });

        describe('when reconfiguring', () => {
          beforeEach(() => {
            props = createTestProps();
            componentInstance = getComponentInstance(
              <ConfigureAdapter {...props}>
                <ChildComponent />
              </ConfigureAdapter>
            );

            jest.spyOn(componentInstance, 'applyAdapterArgs');

            componentInstance.setAdapterState(AdapterStates.CONFIGURED);

            return componentInstance.componentDidUpdate();
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
              expect(componentInstance.adapterState).toEqual(
                AdapterStates.CONFIGURED
              );
            });
          });

          describe('with `pendingAdapterArgs`', () => {
            beforeEach(() => {
              componentInstance.pendingAdapterArgs = {
                custom: { pending: 'arg' },
              };
              return componentInstance.componentDidMount().catch(() => {});
            });

            it('should set the `adapterState` to configured', () => {
              expect(componentInstance.adapterState).toEqual(
                AdapterStates.CONFIGURED
              );
            });

            it('should apply the `pendingAdapterArgs`', () => {
              expect(componentInstance.applyAdapterArgs).toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('when `shouldDeferAdapterConfiguration` is `true`', () => {
      let props;
      let componentInstance;

      beforeEach(() => {
        props = createTestProps({ shouldDeferAdapterConfiguration: true });
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        return componentInstance.componentDidUpdate();
      });

      it('should not invoke `configure` on `adapter`', () => {
        expect(props.adapter.configure).not.toHaveBeenCalled();
      });
    });
  });
});

describe('interacting', () => {
  let props;
  let componentInstance;
  const nextAdapterArgs = {
    user: 'next-user',
  };

  describe('applyAdapterArgs', () => {
    describe('when configured', () => {
      beforeEach(() => {
        props = createTestProps();
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        componentInstance.setAdapterState(AdapterStates.CONFIGURED);
        componentInstance.applyAdapterArgs(nextAdapterArgs, {
          shouldOverwrite: false,
        });
      });

      it('should update the `state` of `appliedAdapterArgs`', () => {
        expect(componentInstance.state).toEqual(
          expect.objectContaining({ appliedAdapterArgs: nextAdapterArgs })
        );
      });

      describe('with `pendingAdapterArgs`', () => {
        const pendingAdapterArgs = {
          group: 'next-group',
        };

        beforeEach(() => {
          componentInstance.setPendingAdapterArgs({
            adapterArgs: pendingAdapterArgs,
            options: { shouldOverwrite: false },
          });
          componentInstance.applyAdapterArgs(nextAdapterArgs, {
            shouldOverwrite: false,
          });
        });

        it('should unset the `pendingAdapterArgs` to `null`', () => {
          expect(componentInstance.pendingAdapterArgs).toBeNull();
        });
      });
    });
  });

  describe('setPendingAdapterArgs', () => {
    beforeEach(() => {
      props = createTestProps();
      componentInstance = getComponentInstance(
        <ConfigureAdapter {...props}>
          <ChildComponent />
        </ConfigureAdapter>
      );
    });

    describe('without `pendingAdapterArgs`', () => {
      beforeEach(() => {
        componentInstance.setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });
      });

      it('should set `pendingAdapterArgs` to `nextAdapterArgs', () => {
        expect(componentInstance.pendingAdapterArgs).toEqual(
          expect.objectContaining(nextAdapterArgs)
        );
      });
    });

    describe('with `pendingAdapterArgs`', () => {
      const nextNextAdapterArgs = {
        firstName: 'user-first-name',
      };
      beforeEach(() => {
        componentInstance.setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });
        componentInstance.setPendingAdapterArgs({
          adapterArgs: nextNextAdapterArgs,
          options: { shouldOverwrite: false },
        });
      });

      it('should set `pendingAdapterArgs` merged with `pendingAdapterArgs', () => {
        expect(componentInstance.pendingAdapterArgs).toEqual(
          expect.objectContaining(nextAdapterArgs)
        );

        expect(componentInstance.pendingAdapterArgs).toEqual(
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
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        componentInstance.setPendingAdapterArgs({
          adapterArgs: nextAdapterArgs,
          options: { shouldOverwrite: false },
        });

        adapterArgsForConfiguration = componentInstance.getAdapterArgsForConfiguration();
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
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        adapterArgsForConfiguration = componentInstance.getAdapterArgsForConfiguration();
      });

      it('should return `appliedAdapterArgs`', () => {
        expect(adapterArgsForConfiguration).toEqual(
          componentInstance.state.appliedAdapterArgs
        );
      });
    });
  });

  describe('reconfigureOrQueue', () => {
    describe('when adapter is configured', () => {
      beforeEach(() => {
        props = createTestProps();
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        jest.spyOn(componentInstance, 'applyAdapterArgs');

        componentInstance.setAdapterState(AdapterStates.CONFIGURED);

        componentInstance.reconfigureOrQueue(nextAdapterArgs, {
          shouldOverwrite: false,
        });
      });

      it('should invoke `applyAdapterArgs`', () => {
        expect(componentInstance.applyAdapterArgs).toHaveBeenCalled();
      });

      it('should invoke `applyAdapterArgs` with `nextAdapterArgs`', () => {
        expect(componentInstance.applyAdapterArgs).toHaveBeenCalledWith(
          expect.objectContaining(nextAdapterArgs)
        );
      });
    });

    describe('when adapter is configuring', () => {
      beforeEach(() => {
        props = createTestProps();
        componentInstance = getComponentInstance(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        jest.spyOn(componentInstance, 'setPendingAdapterArgs');

        componentInstance.setAdapterState(AdapterStates.CONFIGURING);

        componentInstance.reconfigureOrQueue(nextAdapterArgs, {
          shouldOverwrite: false,
        });
      });

      it('should invoke `setPendingAdapterArgs`', () => {
        expect(componentInstance.setPendingAdapterArgs).toHaveBeenCalled();
      });

      it('should invoke `setPendingAdapterArgs` with `nextAdapterArgs`', () => {
        expect(componentInstance.setPendingAdapterArgs).toHaveBeenCalledWith(
          expect.objectContaining({ adapterArgs: nextAdapterArgs })
        );
      });

      it('should invoke `setPendingAdapterArgs` with `options`', () => {
        expect(componentInstance.setPendingAdapterArgs).toHaveBeenCalledWith(
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
