import { renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';

import Configure from '../../components/configure';
import useFeatureToggle from './use-feature-toggle';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

const TestComponent = () => {
  const isEnabledFeatureEnabled = useFeatureToggle('enabledFeature');
  const isDisabledFeatureDisabled = useFeatureToggle('disabledFeature');
  const flagVariation = useFeatureToggle('variation', null);

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
      <li>Variation: {flagVariation}</li>
    </ul>
  );
};

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
