import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import injectFeatureToggles from './inject-feature-toggles';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('without `propKey`', () => {
  const FlagsToComponent = props => (
    <components.FlagsToComponent {...props} propKey="featureToggles" />
  );
  const TestComponent = injectFeatureToggles([
    'disabledFeature',
    'enabledFeature',
  ])(FlagsToComponent);

  it('should have feature enabling prop for `enabledFeature`', () => {
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
  });

  it('should have feature disabling prop for `disabledFeature`', () => {
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
  });
});

describe('with `propKey`', () => {
  const FlagsToComponent = props => (
    <components.FlagsToComponent {...props} propKey="onOffs" />
  );
  const TestComponent = injectFeatureToggles(
    ['disabledFeature', 'enabledFeature'],
    'onOffs'
  )(FlagsToComponent);

  it('should have feature enabling prop for `enabledFeature`', () => {
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
  });

  it('should have feature disabling prop for `disabledFeature`', () => {
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
  });
});
