import { defaultFlags, renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../../../test-utils';
import Configure from '../../components/configure';
import { STATE_SLICE } from '../../store/constants';
import useAllFeatureToggles from './use-all-feature-toggles';

jest.mock('tiny-warning');

const disabledDefaultFlags = Object.fromEntries(
  Object.entries(defaultFlags).filter(([, isEnabled]) => !isEnabled)
);
const enabledDefaultFlags = Object.fromEntries(
  Object.entries(defaultFlags).filter(([, isEnabled]) => isEnabled)
);

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

function TestComponent() {
  const allFlags = useAllFeatureToggles(['memory']);

  return (
    <ul>
      {Object.entries(allFlags).map(([flagName, flagValue]) => (
        <li key={flagName}>
          {`${flagName} is ${flagValue ? 'enabled' : 'disabled'}`}
        </li>
      ))}
    </ul>
  );
}

describe('disabled features', () => {
  it.each(Object.keys(disabledDefaultFlags))(
    'should list disabled feature "%s"',
    async (featureName) => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: defaultFlags } },
      });
      const { waitUntilConfigured } = render(store, <TestComponent />);

      await waitUntilConfigured();

      expect(
        screen.getByText(`${featureName} is disabled`)
      ).toBeInTheDocument();
    }
  );
});

describe('enabled features', () => {
  it.each(Object.keys(enabledDefaultFlags))(
    'should list enabled feature "%s"',
    async (featureName) => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: defaultFlags } },
      });
      const { waitUntilConfigured } = render(store, <TestComponent />);

      await waitUntilConfigured();

      expect(screen.getByText(`${featureName} is enabled`)).toBeInTheDocument();
    }
  );
});
