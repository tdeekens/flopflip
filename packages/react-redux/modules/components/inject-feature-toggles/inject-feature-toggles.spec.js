import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import { ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import memoryAdapter from '@flopflip/memory-adapter';
import configureStore from 'redux-mock-store';
import Configure from '../configure';
import { STATE_SLICE } from './../../store';
import { mapStateToProps } from './inject-feature-toggles';
import injectFeatureToggles from './inject-feature-toggles';

describe('mapStateToProps', () => {
  describe('with `flags` ', () => {
    const flags = { flag1: true };
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `ALL_FLAGS_PROP_KEY` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS_PROP_KEY]).toEqual(flags);
    });
  });

  describe('without `flags` ', () => {
    const flags = {};
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `ALL_FLAGS_PROP_KEY` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS_PROP_KEY]).toEqual(flags);
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

describe('injectFeatureToggles', () => {
  describe('without `propKey`', () => {
    const InjectedComponent = injectFeatureToggles(['flag1', 'flag2'])(
      FeatureComponent
    );
    let props;
    let wrapper;

    let Container;
    describe('when feature is disabled', () => {
      beforeEach(() => {
        const store = createMockStore({
          [STATE_SLICE]: { flags: { flag1: false, flag2: false } },
        });
        props = createTestProps();
        Container = () => <InjectedComponent />;
        wrapper = mount(
          <Provider store={store}>
            <Configure {...props} adapter={memoryAdapter}>
              <Container />
            </Configure>
          </Provider>
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should have feature disabling prop for `flag1`', () => {
        expect(wrapper.find(FeatureComponent)).toHaveProp(
          'featureToggles',
          expect.objectContaining({ flag1: false })
        );
      });

      it('should have feature disabling prop for `flag2`', () => {
        expect(wrapper.find(FeatureComponent)).toHaveProp(
          'featureToggles',
          expect.objectContaining({ flag2: false })
        );
      });

      describe('when enabling feature', () => {
        beforeEach(() => {
          const store = createMockStore({
            [STATE_SLICE]: { flags: { flag1: true } },
          });
          props = createTestProps();
          Container = () => <InjectedComponent />;
          wrapper = mount(
            <Provider store={store}>
              <Configure {...props} adapter={memoryAdapter}>
                <Container />
              </Configure>
            </Provider>
          );
        });

        it('should match snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });

        it('should have feature enabling prop for `flag1`', () => {
          expect(wrapper.find(FeatureComponent)).toHaveProp(
            'featureToggles',
            expect.objectContaining({ flag1: true })
          );
        });
      });
    });
  });

  describe('with `propKey`', () => {
    const InjectedComponent = injectFeatureToggles(['flag1'], 'fooBar')(
      FeatureComponent
    );
    let props;
    let wrapper;

    let Container;
    beforeEach(() => {
      const store = createMockStore({
        [STATE_SLICE]: { flags: { flag1: false } },
      });
      props = createTestProps();
      Container = () => <InjectedComponent />;
      wrapper = mount(
        <Provider store={store}>
          <Configure {...props} adapter={memoryAdapter}>
            <Container />
          </Configure>
        </Provider>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have feature disabling `propKey`', () => {
      expect(wrapper.find(FeatureComponent)).toHaveProp('fooBar');
    });
  });
});
