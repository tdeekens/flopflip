import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { STATE_SLICE } from '../../store';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';
import memoryAdapter from '@flopflip/memory-adapter';

const FeatureComponent = () => <div />;
FeatureComponent.displayName = 'FeatureComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});
const createMockStore = configureStore();

describe('without `propKey`', () => {
  const EnhancedComponent = injectFeatureToggle('flag1')(FeatureComponent);
  let props;
  let wrapper;

  describe('when feature is disabled', () => {
    beforeEach(() => {
      const store = createMockStore({
        [STATE_SLICE]: { flags: { flag1: false } },
      });
      props = createTestProps();
      wrapper = mount(
        <Provider store={store}>
          <Configure {...props} adapter={memoryAdapter}>
            <EnhancedComponent />
          </Configure>
        </Provider>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have feature disabling prop', () => {
      expect(wrapper.find(FeatureComponent)).toHaveProp(
        'isFeatureEnabled',
        false
      );
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        const store = createMockStore({
          [STATE_SLICE]: { flags: { flag1: true } },
        });
        props = createTestProps();
        wrapper = mount(
          <Provider store={store}>
            <Configure {...props} adapter={memoryAdapter}>
              <EnhancedComponent />
            </Configure>
          </Provider>
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should have feature enabling prop', () => {
        expect(wrapper.find(FeatureComponent)).toHaveProp(
          'isFeatureEnabled',
          true
        );
      });
    });
  });
});
