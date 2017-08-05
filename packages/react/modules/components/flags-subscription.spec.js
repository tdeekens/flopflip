import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import FlagSubscription from './flags-subscription';

jest.mock('@flopflip/launchdarkly-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

const ChildComponet = () => <div />;
const createTestProps = props => ({
  shouldInitialize: () => true,
  clientSideId: 'foo-clientSideId',
  user: {
    key: 'foo-user-key',
  },
  onUpdateFlags: jest.fn(),
  onUpdateStatus: jest.fn(),
  children: ChildComponet,

  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <FlagSubscription {...props}>
        <ChildComponet />
      </FlagSubscription>
    );
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render `children`', () => {
    expect(wrapper).toRender('ChildComponet');
  });
});

describe('interacting', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <FlagSubscription {...props}>
        <ChildComponet />
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
        client: undefined,
        onUpdateFlags: props.onUpdateFlags,
        onUpdateStatus: expect.any(Function),
      });
    });

    it('should invoke `listen` with `onUpdateStatus`', () => {
      expect(listen).toHaveBeenCalledWith({
        client: undefined,
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
});

describe('lifecycle', () => {
  describe('componentDidMount', () => {
    let wrapper;
    let props;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <FlagSubscription {...props}>
          <ChildComponet />
        </FlagSubscription>
      );
    });

    describe('when `shouldInitialize` returns `true`', () => {
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

    describe('when `shouldInitialize` returns `false`', () => {
      beforeEach(() => {
        listen.mockClear();

        props = createTestProps({ shouldInitialize: () => false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponet />
          </FlagSubscription>
        );

        wrapper.setState({ isInitialized: false });
        wrapper.instance().componentDidMount();
      });

      it('should not invoke `listen` on `launchdarkly-wrapper`', () => {
        expect(listen).not.toHaveBeenCalled();
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let wrapper;
    let props;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <FlagSubscription {...props}>
          <ChildComponet />
        </FlagSubscription>
      );
    });

    describe('when `shouldInitialize` returns `true`', () => {
      beforeEach(() => {
        listen.mockClear();
      });

      describe('when not initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: false });
          wrapper.instance().componentWillReceiveProps();
        });

        it('should invoke `listen` on `launchdarkly-wrapper`', () => {
          expect(listen).toHaveBeenCalled();
        });
      });

      describe('when already initialized', () => {
        beforeEach(() => {
          wrapper.setState({ isInitialized: true });
          wrapper.instance().componentWillReceiveProps();
        });

        it('should not invoke `listen` on `launchdarkly-wrapper` again', () => {
          // 0 as we reset the mock in the `beforeEach`
          expect(listen).not.toHaveBeenCalled();
        });
      });
    });

    describe('when `shouldInitialize` returns `false`', () => {
      beforeEach(() => {
        props = createTestProps({ shouldInitialize: () => false });
        wrapper = shallow(
          <FlagSubscription {...props}>
            <ChildComponet />
          </FlagSubscription>
        );

        wrapper.setState({ isInitialized: false });
        wrapper.instance().componentWillReceiveProps();
      });

      it('should not invoke `listen` on `launchdarkly-wrapper`', () => {
        expect(listen).not.toHaveBeenCalled();
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
        <ChildComponet />
      </FlagSubscription>
    );
  });

  describe('isInitialized', () => {
    describe('when rendered', () => {
      it('should be `false`', () => {
        expect(wrapper.state('isInitialized')).toBe(false);
      });
    });

    describe('when flag listening was initialized', () => {
      beforeEach(() => {
        wrapper.instance().initializeFlagListening();
      });

      it('should be `true`', () => {
        expect(wrapper.state('isInitialized')).toBe(true);
      });
    });
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `user` to an empty object', () => {
      expect(FlagSubscription.defaultProps.user).toEqual({});
    });
  });
});
