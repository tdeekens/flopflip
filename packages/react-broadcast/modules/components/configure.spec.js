import React from 'react';
import { shallow } from 'enzyme';
import Configure, { FLAGS_CHANNEL } from './configure';

const ChildComponent = () => <div />;

const createTestProps = custom => ({
  client: { __client__: '__internal__' },
  user: { key: '123' },
  clientSideId: '456',

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <Configure {...props}>
        <ChildComponent />
      </Configure>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `FlagsSubcription`', () => {
    expect(wrapper).toRender('FlagsSubscription');
  });

  it('should render a `Broadcast`', () => {
    expect(wrapper).toRender('Broadcast');
  });

  describe('with `children`', () => {
    let props;

    beforeEach(() => {
      props = createTestProps();

      wrapper = shallow(
        <Configure {...props}>
          <ChildComponent />
        </Configure>
      );
    });

    it('should render `children`', () => {
      expect(wrapper).toRender(ChildComponent);
    });
  });

  describe('`of <FlagsSubscription />`', () => {
    let flagsSubscriptionWrapper;

    beforeEach(() => {
      flagsSubscriptionWrapper = wrapper.find('FlagsSubscription');
    });

    it('should receive `clientSideId`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'clientSideId',
        props.clientSideId
      );
    });

    it('should receive `user`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp('user', props.user);
    });
  });
});

describe('state', () => {
  let props;
  let wrapper;

  describe('when updating flags', () => {
    const newFlags = { flag1: true, flag2: false };

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <Configure {...props}>
          <ChildComponent />
        </Configure>
      );

      wrapper.instance().handleUpdateFlags(newFlags);
    });

    it('should update the state', () => {
      expect(wrapper).toHaveState('flags', newFlags);
    });
  });

  describe('handleUpdateStatus', () => {
    const newStatus = { isReady: true };

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <Configure {...props}>
          <ChildComponent />
        </Configure>
      );

      wrapper.instance().handleUpdateStatus(newStatus);
    });

    it('should update the state', () => {
      expect(wrapper).toHaveState('status', newStatus);
    });
  });

  describe('of `<Broadcast />`', () => {
    it('should receive `flags` as `value`', () => {
      expect(wrapper.find('Broadcast')).toHaveProp(
        'value',
        wrapper.state('flags')
      );
    });

    it('should receive `FLAGS_CHANNEL` as `channel`', () => {
      expect(wrapper.find('Broadcast')).toHaveProp('channel', FLAGS_CHANNEL);
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <Configure {...props}>
        <ChildComponent />
      </Configure>
    );
  });

  describe('of `<FlagsSubscription />`', () => {
    let flagsSubscriptionWrapper;

    beforeEach(() => {
      flagsSubscriptionWrapper = wrapper.find('FlagsSubscription');
    });

    it('should receive `onUpdateFlags`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'onUpdateStatus',
        wrapper.instance().handleUpdateStatus
      );
    });

    it('should receive `onUpdateFlags`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'onUpdateFlags',
        wrapper.instance().handleUpdateFlags
      );
    });

    it('should receive `shouldInitialize`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'shouldInitialize',
        wrapper.prop('shouldInitialize')
      );
    });
  });
});

describe('statics', () => {
  describe('displayName', () => {
    it('should be set to `ConfigureFlopflip`', () => {
      expect(Configure.displayName).toEqual('ConfigureFlopflip');
    });
  });

  describe('defaultProps', () => {
    it('should default `user` to an empty object', () => {
      expect(Configure.defaultProps.user).toEqual({});
    });

    it('should default `children` to `null`', () => {
      expect(Configure.defaultProps.children).toBe(null);
    });

    it('should default `shouldInitialize` to `true`', () => {
      expect(Configure.defaultProps.shouldInitialize()).toBe(true);
    });
  });
});
