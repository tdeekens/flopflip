import React from 'react';
import { shallow } from 'enzyme';
import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import { Configure } from './configure';

jest.mock('@flopflip/launchdarkly-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

const ChildComponent = () => <div />;
const createTestProps = custom => ({
  client: { __client__: '__internal__' },
  user: { key: '123' },
  clientSideId: '456',

  // HoC
  handleUpdateFlags: jest.fn(),
  handleUpdateStatus: jest.fn(),

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<Configure {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `FlagsSubcription`', () => {
    expect(wrapper).toRender('FlagsSubscription');
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

    it('should receive `defaultFlags`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'defaultFlags',
        wrapper.prop('defaultFlags')
      );
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
        props.handleUpdateStatus
      );
    });

    it('should receive `onUpdateFlags`', () => {
      expect(flagsSubscriptionWrapper).toHaveProp(
        'onUpdateFlags',
        props.handleUpdateFlags
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

    it('should default `defaultFlags` to an empty object', () => {
      expect(Configure.defaultProps.defaultFlags).toEqual({});
    });

    it('should default `children` to `null`', () => {
      expect(Configure.defaultProps.children).toBe(null);
    });

    it('should default `shouldInitialize` to `true`', () => {
      expect(Configure.defaultProps.shouldInitialize()).toBe(true);
    });
  });
});
