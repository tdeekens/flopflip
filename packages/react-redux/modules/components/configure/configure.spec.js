import React from 'react';
import { shallow } from 'enzyme';
import { ConfigureAdapter } from '@flopflip/react';
import { Configure } from './configure';

const ChildComponent = () => <div />;
const createTestProps = custom => ({
  adapter: {
    configure: jest.fn(),
    reconfigure: jest.fn(),
  },
  adapterArgs: {
    fooId: 'foo-id',
  },

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

  it('should render a `<ConfigureAdapter>`', () => {
    expect(wrapper).toRender(ConfigureAdapter);
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

  describe('`of <ConfigureAdapter />`', () => {
    let configureAdapterWrapper;

    beforeEach(() => {
      configureAdapterWrapper = wrapper.find(ConfigureAdapter);
    });

    it('should receive `adapterArgs`', () => {
      expect(configureAdapterWrapper).toHaveProp(
        'adapterArgs',
        expect.objectContaining({})
      );
    });

    it('should receive `onStatusStateChange` and `onFlagsStateChange` in `adapterArgs`', () => {
      expect(configureAdapterWrapper).toHaveProp(
        'adapterArgs',
        expect.objectContaining({
          onStatusStateChange: props.handleUpdateStatus,
          onFlagsStateChange: props.handleUpdateFlags,
        })
      );
    });

    it('should receive `defaultFlags`', () => {
      expect(configureAdapterWrapper).toHaveProp(
        'defaultFlags',
        wrapper.prop('defaultFlags')
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
    it('should default `defaultFlags` to an empty object', () => {
      expect(Configure.defaultProps.defaultFlags).toEqual({});
    });

    it('should default `children` to `null`', () => {
      expect(Configure.defaultProps.children).toBe(null);
    });

    it('should default `shouldDeferAdapterConfiguration` to `true`', () => {
      expect(Configure.defaultProps.shouldDeferAdapterConfiguration).toBe(
        false
      );
    });
  });
});
