import { defaultFlags, renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../../components/configure';
import useAllFeatureToggles from './use-all-feature-toggles';

const disabledDefaultFlags = Object.fromEntries(
  Object.entries(defaultFlags).filter(([, isEnabled]) => !isEnabled)
);
const enabledDefaultFlags = Object.fromEntries(
  Object.entries(defaultFlags).filter(([, isEnabled]) => isEnabled)
);

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
    },
  });

function TestComponent() {
  const allFlags = useAllFeatureToggles(['memory']);

  return (
    <ul>
      {Object.entries(allFlags).map(([flagName, flagValue]) => (
        <li key={flagName}>
          {`${flagName} is ${flagValue ? 'enabled' : 'disabled'}`}
        </li>
      ))}
    </ul>
  );
}

describe('disabled features', () => {
  it.each(Object.keys(disabledDefaultFlags))(
    'should list disabled feature "%s"',
    async (featureName) => {
      const { waitUntilConfigured } = render(<TestComponent />);

      await waitUntilConfigured();

      expect(
        screen.getByText(`${featureName} is disabled`)
      ).toBeInTheDocument();
    }
  );
});

describe('enabled features', () => {
  it.each(Object.keys(enabledDefaultFlags))(
    'should list enabled feature "%s"',
    async (featureName) => {
      const { waitUntilConfigured } = render(<TestComponent />);

      await waitUntilConfigured();

      expect(screen.getByText(`${featureName} is enabled`)).toBeInTheDocument();
    }
  );
});
