import { renderWithAdapter, screen } from '@flopflip/test-utils';
import { describe, expect, it } from 'vitest';

import React from 'react';
import { Provider } from 'react-redux';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { useFeatureToggles } from '../src/use-feature-toggles';
import { createStore } from './test-utils';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
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
