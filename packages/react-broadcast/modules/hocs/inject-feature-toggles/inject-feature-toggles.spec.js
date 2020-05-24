import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import injectFeatureToggles from './inject-feature-toggles';
import Configure from '../configure';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

const FlagsToComponent = (props) => (
  <components.FlagsToComponent {...props} propKey="featureToggles" />
);
const FlagsToComponentWithPropKey = (props) => (
  <components.FlagsToComponent {...props} propKey="onOffs" />
);

describe('without `propKey`', () => {
  it('should have feature enabling prop for `enabledFeature`', async () => {
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    const rendered = render(<TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
      'true'
    );
  });

  it('should have feature disabling prop for `disabledFeature`', async () => {
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    const rendered = render(<TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
      'false'
    );
  });

  describe('when enabling feature', () => {
    it('should render the component representing a enabled feature', async () => {
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const rendered = render(<TestComponent />);

      await rendered.waitUntilConfigured();

      rendered.changeFlagVariation('disabledFeature', true);

      expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
        'true'
      );
    });
  });
});

describe('with `propKey`', () => {
  it('should have feature enabling prop for `enabledFeature`', async () => {
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponentWithPropKey);

    const rendered = render(<TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
      'true'
    );
  });

  it('should have feature disabling prop for `disabledFeature`', async () => {
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponentWithPropKey);

    const rendered = render(<TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
      'false'
    );
  });
});
