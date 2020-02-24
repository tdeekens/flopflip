import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import ToggleFeature from './toggle-feature';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });
const TestEnabledComponent = () => (
  <ToggleFeature flag="disabledFeature">
    <components.ToggledComponent flagName="disabledFeature" />
  </ToggleFeature>
);
const TestDisabledComponent = () => (
  <ToggleFeature flag="enabledFeature">
    <components.ToggledComponent flagName="enabledFeature" />
  </ToggleFeature>
);

describe('when feature is disabled', () => {
  it('should not render the component representing a enabled feature', async () => {
    const rendered = render(<TestEnabledComponent />);

    expect(rendered.queryByFlagName('disabledFeature')).not.toBeInTheDocument();

    await rendered.waitUntilConfigured();
  });

  describe('when enabling feature', () => {
    it('should render the component representing a enabled feature', async () => {
      const rendered = render(<TestEnabledComponent />);

      await rendered.waitUntilConfigured();

      rendered.changeFlagVariation('disabledFeature', true);

      expect(rendered.queryByFlagName('disabledFeature')).toBeInTheDocument();
    });
  });
});

describe('when feature is enabled', () => {
  it('should render the component representing a enabled feature', async () => {
    const rendered = render(<TestDisabledComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByFlagName('enabledFeature')).toHaveAttribute(
      'data-flag-status',
      'enabled'
    );
  });
});
