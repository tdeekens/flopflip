import React from 'react';
import { renderWithAdapter } from '@flopflip/test-utils';
import ToggleFeature from './toggle-feature';
import Configure from '../configure';

const FeatureComponent = () => <div>Feature is enabled</div>;
FeatureComponent.displayName = 'FeatureComponent';

const render = TestComponent =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

describe('when feature is disabled', () => {
  const TestComponent = () => (
    <ToggleFeature flag="disabledFeature">
      <FeatureComponent />
    </ToggleFeature>
  );
  it('should not render the `FeatureComponent`', () => {
    const { queryByText } = render(<TestComponent />);

    expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
  });
});

describe('when feature is enabled', () => {
  const TestComponent = () => (
    <ToggleFeature flag="enabledFeature">
      <FeatureComponent />
    </ToggleFeature>
  );
  it('should not render the `FeatureComponent`', () => {
    const { queryByText } = render(<TestComponent />);

    expect(queryByText('Feature is enabled')).toBeInTheDocument();
  });
});
