import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import ToggleFeature from './toggle-feature';
import Configure from '../configure';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('when feature is disabled', () => {
  const TestComponent = () => (
    <ToggleFeature flag="disabledFeature">
      <components.ToggledComponent flagName="disabledFeature" />
    </ToggleFeature>
  );
  it('should not render the component representing a enabled feature', () => {
    const rendered = render(<TestComponent />);

    expect(rendered.queryByFlagName('disabledFeature')).not.toBeInTheDocument();
  });

  describe('when enabling feature', () => {
    it('should render the component representing a enabled feature', async () => {
      const rendered = render(<TestComponent />);

      await rendered.waitUntilReady();

      rendered.changeFlagVariation('disabledFeature', true);

      expect(rendered.queryByFlagName('disabledFeature')).toBeInTheDocument();
    });
  });
});

describe('when feature is enabled', () => {
  const TestComponent = () => (
    <ToggleFeature flag="enabledFeature">
      <components.ToggledComponent flagName="enabledFeature" />
    </ToggleFeature>
  );
  it('should render the component representing a enabled feature', () => {
    const rendered = render(<TestComponent />);

    expect(rendered.queryByFlagName('enabledFeature')).toHaveAttribute(
      'data-flag-status',
      'enabled'
    );
  });
});
