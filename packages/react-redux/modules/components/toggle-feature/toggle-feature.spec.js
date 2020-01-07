import { Provider } from 'react-redux';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import React from 'react';
import { createStore } from '../../../test-utils';
import Configure from '../configure';
import { STATE_SLICE } from './../../store/constants';
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

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('<ToggleFeature>', () => {
  describe('when feature is disabled', () => {
    let store;
    const TestComponent = () => (
      <ToggleFeature flag="disabledFeature">
        <components.ToggledComponent flagName="disabledFeature" />
      </ToggleFeature>
    );

    beforeEach(() => {
      store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
    });

    it('should not render the component representing a enabled feature', () => {
      const rendered = render(store, <TestComponent />);

      expect(
        rendered.queryByFlagName('disabledFeature')
      ).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const rendered = render(store, <TestComponent />);

        await rendered.waitUntilReady();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('disabledFeature')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    let store;
    const TestComponent = () => (
      <ToggleFeature flag="enabledFeature">
        <components.ToggledComponent flagName="enabledFeature" />
      </ToggleFeature>
    );

    beforeEach(() => {
      store = createStore({
        [STATE_SLICE]: { flags: { enabledFeature: true } },
      });
    });

    it('should render the component representing a enabled feature', () => {
      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('enabledFeature')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});
