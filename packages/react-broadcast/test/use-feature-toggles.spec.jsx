import { renderWithAdapter, screen } from '@flopflip/test-utils';
import { expect, it } from 'vitest';

import { Configure } from '../src/configure';
import { useFeatureToggles } from '../src/use-feature-toggles';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

function TestComponent() {
  const [isEnabledFeatureEnabled, isDisabledFeatureDisabled] =
    useFeatureToggles({
      enabledFeature: true,
      disabledFeature: true,
    });

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
    </ul>
  );
}

it('should indicate a feature being disabled', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText('Is disabled: Yes')).toBeInTheDocument();
});

it('should indicate a feature being enabled', async () => {
  const { waitUntilConfigured } = render(<TestComponent />);

  await waitUntilConfigured();

  expect(screen.getByText('Is enabled: Yes')).toBeInTheDocument();
});
