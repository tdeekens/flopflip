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
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('disabledFeature')).not.toBeInTheDocument();
  });
});

describe('when feature is enabled', () => {
  const TestComponent = () => (
    <ToggleFeature flag="enabledFeature">
      <components.ToggledComponent flagName="enabledFeature" />
    </ToggleFeature>
  );
  it('should render the component representing a enabled feature', () => {
    const { queryByFlagName } = render(<TestComponent />);

    expect(queryByFlagName('enabledFeature')).toHaveAttribute(
      'data-flag-status',
      'enabled'
    );
  });
});
