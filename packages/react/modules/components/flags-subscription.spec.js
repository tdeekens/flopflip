import React from 'react';
import { shallow } from 'enzyme';
import {
  initialize,
  listen,
  changeUserContext,
  camelCaseFlags,
} from '@flopflip/launchdarkly-wrapper';
import FlagSubscription from './flags-subscription';

// Can not be referenced from the mock
const clientInstance = '__client-instance__';

jest.mock('@flopflip/launchdarkly-wrapper', () => ({
  initialize: jest.fn(() => '__client-instance__'),
  listen: jest.fn(),
  changeUserContext: jest.fn(),
  camelCaseFlags: jest.fn(_ => _),
}));

const ChildComponent = () => <div />;
const createTestProps = props => ({
  shouldInitialize: true,
  shouldChangeUserContext: false,
  clientSideId: 'foo-clientSideId',
  user: {
    key: 'foo-user-key',
  },
  onUpdateFlags: jest.fn(),
  onUpdateStatus: jest.fn(),
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

describe('interacting', () => {
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

  describe('initializeFlagListening', () => {
    beforeEach(() => {
      wrapper.instance().initializeFlagListening();
    });

    it('should invoke `listen` on `launchdarkly-wrapper`', () => {
      expect(listen).toHaveBeenCalled();
    });

    it('should invoke `listen` with `onUpdateFlags`', () => {
      expect(listen).toHaveBeenCalledWith({
        client: clientInstance,
        onUpdateFlags: props.onUpdateFlags,
        onUpdateStatus: expect.any(Function),
      });
    });

    it('should cache `client` on instance', () => {
      expect(wrapper.instance().client).toEqual(clientInstance);
    });

    it('should invoke `listen` with `onUpdateStatus`', () => {
      expect(listen).toHaveBeenCalledWith({
        client: clientInstance,
        onUpdateFlags: expect.any(Function),
        onUpdateStatus: props.onUpdateStatus,
      });
    });

    it('should invoke `initialize` on `launchdarkly-wrapper`', () => {
      expect(initialize).toHaveBeenCalled();
    });

    it('should invoke `initialize` with `clientSideId`', () => {
      expect(initialize).toHaveBeenCalledWith({
        clientSideId: props.clientSideId,
        user: expect.any(Object),
      });
    });

    it('should invoke `initialize` with `user`', () => {
      expect(initialize).toHaveBeenCalledWith({
        clientSideId: expect.any(String),
        user: props.user,
      });
    });
  });

  describe('changeUserContext', () => {
    let client;
    let props;

    beforeEach(() => {
      client = { __id__: 'foo-client' };
      props = createTestProps();

      wrapper.instance().client = client;
      wrapper.instance().changeUserContext();
    });

    it('should invoke `changeUserContext` on the `launchdarkly-wrapper`', () => {
      expect(changeUserContext).toHaveBeenCalledWith({
        client,
        user: props.user,
      });
    });
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

    describe('when `shouldInitialize` is `true`', () => {
      beforeEach(() => {
        listen.mockClear();
      });

      describe('when not initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: false });
          wrapper.instance().componentDidMount();
        });

        it('should invoke `listen` on `launchdarkly-wrapper`', () => {
          expect(listen).toHaveBeenCalled();
        });
      });

      describe('when already initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: true });
          wrapper.instance().componentDidMount();
        });

        it('should not invoke `listen` on `launchdarkly-wrapper` again', () => {
          expect(listen).not.toHaveBeenCalled();
        });
      });
    });

    describe('when `shouldInitialize` is `false`', () => {
      beforeEach(() => {
        listen.mockClear();

        props = createTestProps({ shouldInitialize: false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.setState({ isInitialized: false });
        wrapper.instance().componentDidMount();
      });

      it('should not invoke `listen` on `launchdarkly-wrapper`', () => {
        expect(listen).not.toHaveBeenCalled();
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

      it('should invoke `camelCaseFlags` with the `defaultFlags`', () => {
        expect(camelCaseFlags).toHaveBeenCalledWith(props.defaultFlags);
      });

      it('should invoke `onUpdateFlags` with camelcased `defaultFlags`', () => {
        expect(props.onUpdateFlags).toHaveBeenCalledWith(props.defaultFlags);
      });
    });
  });

  describe('componentDidUpdate', () => {
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

    describe('when `shouldInitialize` is `true`', () => {
      beforeEach(() => {
        listen.mockClear();
      });

      describe('when not initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: false });
          wrapper.instance().componentDidUpdate(props);
        });

        it('should invoke `listen` on `launchdarkly-wrapper`', () => {
          expect(listen).toHaveBeenCalled();
        });
      });

      describe('when already initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: true });
          wrapper.instance().componentDidUpdate(props);
        });

        it('should not invoke `listen` on `launchdarkly-wrapper` again', () => {
          // 0 as we reset the mock in the `beforeEach`
          expect(listen).not.toHaveBeenCalled();
        });
      });
    });

    describe('when `shouldInitialize` is `false`', () => {
      beforeEach(() => {
        props = createTestProps({ shouldInitialize: false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponent />
          </FlagSubscription>
        );

        wrapper.setState({ isInitialized: false });
        wrapper.instance().componentDidUpdate(props);
      });

      it('should not invoke `listen` on `launchdarkly-wrapper`', () => {
        expect(listen).not.toHaveBeenCalled();
      });
    });

    describe('when `user` prop changed', () => {
      describe('with `shouldChangeUserContext` set to `true`', () => {
        let prevProps;

        beforeEach(() => {
          changeUserContext.mockClear();

          props = createTestProps({
            shouldChangeUserContext: true,
          });

          wrapper = shallow(
            <FlagSubscription {...props}>
              <ChildComponent />
            </FlagSubscription>
          );

          prevProps = createTestProps({
            shouldChangeUserContext: true,
            user: {
              key: 'foo-user-key-old',
            },
          });

          wrapper.setState({ isInitialized: false });
          wrapper.instance().componentDidUpdate(prevProps);
        });

        it('should invoke `changeUserContext` on `launchdarkly-wrapper` with new `user`', () => {
          // New user is actually the old
          expect(changeUserContext).toHaveBeenCalledWith({
            user: props.user,
            client: clientInstance,
          });
        });
      });

      describe('with `shouldChangeUserContext` set to `false`', () => {
        let prevProps;
        let client;

        beforeEach(() => {
          changeUserContext.mockClear();

          prevProps = createTestProps({
            user: {
              key: 'foo-user-key-old',
            },
          });
          client = { __id__: 'foo-client' };

          wrapper.instance().client = client;

          wrapper.setState({ isInitialized: false });
          wrapper.instance().componentDidUpdate(prevProps);
        });

        it('should not invoke `changeUserContext` on `launchdarkly-wrapper`', () => {
          // New user is actually the old
          expect(changeUserContext).not.toHaveBeenCalled();
        });
      });
    });
  });
});

describe('state', () => {
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

  describe('isInitialized', () => {
    describe('when rendered', () => {
      it('should be `false`', () => {
        expect(wrapper).toHaveState('isInitialized', false);
      });
    });

    describe('when flag listening was initialized', () => {
      beforeEach(() => {
        wrapper.instance().initializeFlagListening();
      });

      it('should be `true`', () => {
        expect(wrapper).toHaveState('isInitialized', true);
      });
    });
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `user` to an empty object', () => {
      expect(FlagSubscription.defaultProps.user).toEqual({});
    });

    it('should default `defaultFlags` to an empty object', () => {
      expect(FlagSubscription.defaultProps.defaultFlags).toEqual({});
    });
  });
});
