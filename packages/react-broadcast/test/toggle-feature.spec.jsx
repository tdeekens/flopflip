import { components, renderWithAdapter } from '@flopflip/test-utils';
import { describe, expect, it } from 'vitest';

import { Configure } from '../src/configure';
import { ToggleFeature } from '../src/toggle-feature';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });
function TestEnabledComponent() {
  return (
    <ToggleFeature flag="disabledFeature">
      <components.ToggledComponent flagName="disabledFeature" />
    </ToggleFeature>
  );
}

function TestDisabledComponent() {
  return (
    <ToggleFeature flag="enabledFeature">
      <components.ToggledComponent flagName="enabledFeature" />
    </ToggleFeature>
  );
}

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
      const { waitUntilConfigured, getByFlagName, changeFlagVariation } =
        render(<TestEnabledComponent />);

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
