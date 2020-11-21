import React from 'react';
import { Provider } from 'react-redux';
import useFlagVariations from './use-flag-variations';
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

describe('when adaopter is configured', () => {
  it('should indicate a feature being disabled', async () => {
    const store = createStore({
      [STATE_SLICE]: {
        flags: {
          enabledFeature: true,
          disabledFeature: false,
          variation: 'A',
        },
      },
    });

    const rendered = render(store, <TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.getByText('Is disabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a feature being enabled', async () => {
    const store = createStore({
      [STATE_SLICE]: {
        flags: {
          enabledFeature: true,
          disabledFeature: false,
          variation: 'A',
        },
      },
    });

    const rendered = render(store, <TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.getByText('Is enabled: Yes')).toBeInTheDocument();
  });

  it('should indicate a flag variation', async () => {
    const store = createStore({
      [STATE_SLICE]: {
        flags: {
          enabledFeature: true,
          disabledFeature: false,
          variation: 'A',
        },
      },
    });

    const rendered = render(store, <TestComponent />);

    await rendered.waitUntilConfigured();

    expect(rendered.getByText('Variation: A')).toBeInTheDocument();
  });
});
