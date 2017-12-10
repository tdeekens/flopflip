import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import memoryAdapter from '@flopflip/memory-adapter';
import configureStore from 'redux-mock-store';
import Configure from '../configure';
import { STATE_SLICE } from './../../store';
import ToggleFeature, { mapStateToProps } from './toggle-feature';

describe('mapStateToProps', () => {
  describe('with existing `flag` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: true } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(mapStateToProps(state, { flag: 'flag1' }).isFeatureEnabled).toBe(
        true
      );
    });
  });

  describe('without existing `flag` ', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: {} },
      };
    });

    it('should map `isFeatureEnabled` as `false` onto `props`', () => {
      expect(mapStateToProps(state, { flag: 'flag1' }).isFeatureEnabled).toBe(
        false
      );
    });
  });

  describe('with matching `variation`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flag: 'flag1',
          variation: 'flagVariate1',
        }).isFeatureEnabled
      ).toBe(true);
    });
  });

  describe('with non-matching `variation`', () => {
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags: { flag1: 'flagVariate1' } },
      };
    });

    it('should map `isFeatureEnabled` as `true` onto `props`', () => {
      expect(
        mapStateToProps(state, {
          flag: 'flag1',
          variation: 'flagVariate2',
        }).isFeatureEnabled
      ).toBe(false);
    });
  });
});

const FeatureComponent = () => <div />;
FeatureComponent.displayName = 'FeatureComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});
const createMockStore = configureStore();

describe('<ToggleFeature>', () => {
  describe('when feature is disabled', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      const store = createMockStore({
        [STATE_SLICE]: { flags: { flag1: false } },
      });
      props = createTestProps();
      wrapper = mount(
        <Provider store={store}>
          <Configure {...props} adapter={memoryAdapter}>
            <ToggleFeature flag="flag1">
              <FeatureComponent />
            </ToggleFeature>
          </Configure>
        </Provider>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `FeatureComponent`', () => {
      expect(wrapper).not.toRender(FeatureComponent);
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        props = createTestProps();
        const store = createMockStore({
          [STATE_SLICE]: { flags: { flag1: true } },
        });
        props = createTestProps();
        wrapper = mount(
          <Provider store={store}>
            <Configure {...props} adapter={memoryAdapter}>
              <ToggleFeature flag="flag1">
                <FeatureComponent />
              </ToggleFeature>
            </Configure>
          </Provider>
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render the `FeatureComponent`', () => {
        expect(wrapper).toRender(FeatureComponent);
      });
    });
  });
});
