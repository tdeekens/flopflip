import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import Configure from './configure';

jest.mock('@flopflip/launchdarkly-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

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
    expect(toJson(wrapper)).toMatchSnapshot();
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
});

describe('interacting', () => {
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
      expect(wrapper.state('flags')).toEqual(newFlags);
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
      expect(wrapper.state('status')).toEqual(newStatus);
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();

    initialize.mockReturnValue(props.client);

    wrapper = shallow(
      <Configure {...props}>
        <ChildComponent />
      </Configure>
    );
  });

  describe('componentDidMount', () => {
    beforeEach(() => {
      wrapper.instance().componentDidMount();
    });

    it('should `initialize` on the `launchdarkly-wrapper` with `clientSideId` and `user`', () => {
      expect(initialize).toHaveBeenCalledWith({
        clientSideId: props.clientSideId,
        user: props.user,
      });
    });

    it('should `listen` on the `launchdarkly-wrapper`', () => {
      expect(listen).toHaveBeenCalledWith({
        client: props.client,
        updateFlags: wrapper.instance().handleUpdateFlags,
        updateStatus: wrapper.instance().handleUpdateStatus,
      });
    });
  });
});
