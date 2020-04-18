import React from 'react';
import useFlagVariations from './use-flag-variations';
import { renderWithAdapter } from '@flopflip/test-utils';
import Configure from '../../components/configure';

const render = (TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: { ConfigureFlopFlip: Configure },
  });

const TestComponent = () => {
  const [
    isEnabledFeatureEnabled,
    isDisabledFeatureDisabled,
    variation,
  ] = useFlagVariations(['enabledFeature', 'disabledFeature', 'variation']);

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
      <li>Variation: {variation}</li>
    </ul>
  );
};

it('should indicate a feature being disabled', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.getByText('Is disabled: Yes')).toBeInTheDocument();
});

it('should indicate a feature being enabled', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.getByText('Is enabled: Yes')).toBeInTheDocument();
});

it('should indicate a flag variation', async () => {
  const rendered = render(<TestComponent />);

  await rendered.waitUntilConfigured();

  expect(rendered.getByText('Variation: A')).toBeInTheDocument();
});
