import { renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../../components/configure';
import useAllFeatureToggles from './use-all-feature-toggles';

const testFeatures = {
  featureA: true,
  featureB: false,
  featureC: true,
};

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
    },
    flags: testFeatures,
  });

function TestComponent() {
  const allFlags = useAllFeatureToggles();

  return (
    <div>
      <h1>Enabled features</h1>
      <ul>
        {Object.keys(allFlags).map((flagName) => (
          <li key={flagName}>{flagName}</li>
        ))}
      </ul>
    </div>
  );
}

it('should list all enabled features', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  Object.entries(testFeatures).forEach(([featureName, isEnabled]) => {
    if (isEnabled) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(screen.getByText(featureName)).toBeInTheDocument();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(screen.queryByText(featureName)).not.toBeInTheDocument();
    }
  });
});
