import { renderWithAdapter, screen } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { useFeatureToggle } from '../src/use-feature-toggle';
import { createStore } from './test-utils';

vi.mock('tiny-warning');

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

function TestComponent() {
  const isEnabledFeatureEnabled = useFeatureToggle('enabledFeature');
  const isDisabledFeatureDisabled = useFeatureToggle('disabledFeature');

  return (
    <ul>
      <li>Is enabled: {isEnabledFeatureEnabled ? 'Yes' : 'No'}</li>
      <li>Is disabled: {isDisabledFeatureDisabled ? 'No' : 'Yes'}</li>
    </ul>
  );
}

describe('when adapter is configured', () => {
  it('should indicate a feature being disabled', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
    });
    const { waitUntilConfigured } = render(store, <TestComponent />);

    await waitUntilConfigured();

    expect(screen.getByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
    });

    const { waitUntilConfigured } = render(store, <TestComponent />);

    await waitUntilConfigured();

    expect(screen.getByText('Is enabled: Yes')).toBeInTheDocument();
  });
});
