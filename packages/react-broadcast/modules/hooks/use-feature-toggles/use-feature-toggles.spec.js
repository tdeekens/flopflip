import React from 'react';
import useFeatureToggles from './use-feature-toggles';
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
  ] = useFeatureToggles({
    enabledFeature: true,
    disabledFeature: true,
  });

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
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
