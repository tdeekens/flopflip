import { components, renderWithAdapter } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../configure';
import ToggleFeature from './toggle-feature';

const render = (TestComponent) =>
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
    const { waitUntilConfigured, queryByFlagName } = render(
      <TestEnabledComponent />
    );

    expect(queryByFlagName('disabledFeature')).not.toBeInTheDocument();

    await waitUntilConfigured();
  });

  describe('when enabling feature', () => {
    it('should render the component representing a enabled feature', async () => {
      const {
        waitUntilConfigured,
        getByFlagName,
        changeFlagVariation,
      } = render(<TestEnabledComponent />);

      await waitUntilConfigured();

      changeFlagVariation('disabledFeature', true);

      expect(getByFlagName('disabledFeature')).toBeInTheDocument();
    });
  });
});

describe('when feature is enabled', () => {
  it('should render the component representing a enabled feature', async () => {
    const { waitUntilConfigured, queryByFlagName } = render(
      <TestDisabledComponent />
    );

    await waitUntilConfigured();

    expect(queryByFlagName('enabledFeature')).toHaveAttribute(
      'data-flag-status',
      'enabled'
    );
  });
});
