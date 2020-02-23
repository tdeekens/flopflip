import React from 'react';
import { Provider } from 'react-redux';
import useFeatureToggle from './use-feature-toggle';
import { renderWithAdapter } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
import Configure from '../../components/configure';

jest.mock('tiny-warning');

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

const TestComponent = () => {
  const isEnabledFeatureEnabled = useFeatureToggle('enabledFeature');
  const isDisabledFeatureDisabled = useFeatureToggle('disabledFeature');

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
      [STATE_SLICE]: { flags: { disabledFeature: false } },
    });
    const rendered = render(store, <TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { disabledFeature: false } },
    });

    const rendered = render(store, <TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.queryByText('Is enabled: Yes')).toBeInTheDocument();
  });
});
