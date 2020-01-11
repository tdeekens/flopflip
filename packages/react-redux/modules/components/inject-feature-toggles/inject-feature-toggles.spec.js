import { Provider } from 'react-redux';
import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import Configure from '../configure';
import { STATE_SLICE } from './../../store/constants';
import injectFeatureToggles from './inject-feature-toggles';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('injectFeatureToggles', () => {
  describe('without `propKey`', () => {
    let store;
    const FlagsToComponent = props => (
      <components.FlagsToComponent {...props} propKey="featureToggles" />
    );
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    beforeEach(() => {
      store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
    });

    it('should have feature enabling prop for `enabledFeature`', () => {
      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
        'true'
      );
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
        'false'
      );
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const rendered = render(store, <TestComponent />);

        await rendered.waitUntilReady();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
          'true'
        );
      });
    });
  });

  describe('with `propKey`', () => {
    let store;
    const FlagsToComponent = props => (
      <components.FlagsToComponent {...props} propKey="onOffs" />
    );
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponent);

    beforeEach(() => {
      store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
    });

    it('should have feature enabling prop for `enabledFeature`', () => {
      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
        'true'
      );
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
        'false'
      );
    });
  });
});
