import { components, renderWithAdapter } from '@flopflip/test-utils';
import { describe, it, expect } from 'vitest';

import React from 'react';

import Configure from '../../components/configure';
import injectFeatureToggles from './inject-feature-toggles';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

function FlagsToComponent(props) {
  return <components.FlagsToComponent {...props} propKey="featureToggles" />;
}

function FlagsToComponentWithPropKey(props) {
  return <components.FlagsToComponent {...props} propKey="onOffs" />;
}

describe('without `propKey`', () => {
  it('should have feature enabling prop for `enabledFeature`', async () => {
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    const { waitUntilConfigured, queryByFlagName } = render(<TestComponent />);

    await waitUntilConfigured();

    expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
  });

  it('should have feature disabling prop for `disabledFeature`', async () => {
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    const { waitUntilConfigured, queryByFlagName } = render(<TestComponent />);

    await waitUntilConfigured();

    expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
  });

  describe('when enabling feature', () => {
    it('should render the component representing a enabled feature', async () => {
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const { waitUntilConfigured, changeFlagVariation, queryByFlagName } =
        render(<TestComponent />);

      await waitUntilConfigured();

      changeFlagVariation('disabledFeature', true);

      expect(queryByFlagName('disabledFeature')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  it('should have feature enabling prop for `enabledFeature`', async () => {
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponentWithPropKey);

    const { waitUntilConfigured, queryByFlagName } = render(<TestComponent />);

    await waitUntilConfigured();

    expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
  });

  it('should have feature disabling prop for `disabledFeature`', async () => {
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponentWithPropKey);

    const { waitUntilConfigured, queryByFlagName } = render(<TestComponent />);

    await waitUntilConfigured();

    expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
  });
});
