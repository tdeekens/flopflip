import { renderWithAdapter } from '@flopflip/test-utils';
import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../../../test-utils';
import Configure from '../../components/configure';
import { STATE_SLICE } from '../../store/constants';
import useFeatureToggles from './use-feature-toggles';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
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

describe('when adapter is configured', () => {
  it('should indicate a feature being disabled', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
    });

    const { getByText, waitUntilConfigured } = render(store, <TestComponent />);

    await waitUntilConfigured();

    expect(getByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
    });

    const { getByText, waitUntilConfigured } = render(store, <TestComponent />);

    await waitUntilConfigured();

    expect(getByText('Is enabled: Yes')).toBeInTheDocument();
  });
});
