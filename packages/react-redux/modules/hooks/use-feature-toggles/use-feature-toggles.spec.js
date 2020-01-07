import React from 'react';
import { Provider } from 'react-redux';
import useFeatureToggles from './use-feature-toggles';
import { renderWithAdapter } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
import Configure from '../../components/configure';

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

describe('when adapter is ready', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      [STATE_SLICE]: { flags: { disabledFeature: false } },
    });
  });

  it('should indicate a feature being disabled', async () => {
    const { getByText, waitUntilReady } = render(store, <TestComponent />);

    await waitUntilReady();

    expect(getByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const { getByText, waitUntilReady } = render(store, <TestComponent />);

    await waitUntilReady();

    expect(getByText('Is enabled: Yes')).toBeInTheDocument();
  });
});
