import { renderWithAdapter, screen } from '@flopflip/test-utils';
import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../../../test-utils';
import Configure from '../../components/configure';
import { STATE_SLICE } from '../../store/constants';
import useAllFeatureToggles from './use-all-feature-toggles';

jest.mock('tiny-warning');

const testFeatures = {
  featureA: true,
  featureB: false,
  featureC: true,
};

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
    flags: testFeatures,
  });

function TestComponent() {
  const allFlags = useAllFeatureToggles();

  return (
    <div>
      <h1>Enabled features</h1>
      <ul>
        {Object.keys(allFlags).map((flagName) => (
          <li key={flagName}>{flagName}</li>
        ))}
      </ul>
    </div>
  );
}

describe('when adapter is configured', () => {
  it('should list all enabled features', async () => {
    const store = createStore({
      [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
    });
    const { waitUntilConfigured } = render(store, <TestComponent />);

    await waitUntilConfigured();

    Object.entries(testFeatures).forEach(([featureName, isEnabled]) => {
      if (isEnabled) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByText(featureName)).toBeInTheDocument();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.queryByText(featureName)).not.toBeInTheDocument();
      }
    });
  });
});
