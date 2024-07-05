import combineAdapters from '@flopflip/combine-adapters';
import localstorageAdapter from '@flopflip/localstorage-adapter';
import memoryAdapter from '@flopflip/memory-adapter';
import {
  act,
  defaultFlags,
  renderWithAdapter,
  screen,
} from '@flopflip/test-utils';
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

const render = (store, TestComponent, { adapter, adapterArgs } = {}) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
    adapter,
    adapterArgs,
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

describe('with one adapter', () => {
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

        expect(
          screen.getByText(`${featureName} is enabled`)
        ).toBeInTheDocument();
      }
    );
  });
});

describe('when combining adapters', () => {
  let adapterArgs;

  const createAdapterArgs = (customArgs = {}) => ({
    user: { id: 'foo' },
    [memoryAdapter.id]: {
      user: {
        id: 'memory-adapter-user-id',
      },
    },
    [localstorageAdapter.id]: {
      user: {
        id: 'localstorage-adapter-user-id',
      },
    },
    ...customArgs,
  });

  beforeAll(async () => {
    combineAdapters.combine([memoryAdapter, localstorageAdapter]);

    adapterArgs = createAdapterArgs();
  });

  describe('without flag updating', () => {
    it.each(Object.keys(disabledDefaultFlags))(
      'should list disabled feature "%s"',
      async (featureName) => {
        const store = createStore({
          [STATE_SLICE]: {
            flags: { memory: defaultFlags, localstorage: defaultFlags },
          },
        });
        const { waitUntilConfigured } = render(store, <TestComponent />, {
          adapter: combineAdapters,
          adapterArgs,
        });

        await waitUntilConfigured();

        expect(
          screen.getByText(`${featureName} is disabled`)
        ).toBeInTheDocument();
      }
    );

    it.each(Object.keys(enabledDefaultFlags))(
      'should list enabled feature "%s"',
      async (featureName) => {
        const store = createStore({
          [STATE_SLICE]: {
            flags: { memory: defaultFlags, localstorage: defaultFlags },
          },
        });

        const { waitUntilConfigured } = render(store, <TestComponent />, {
          adapter: combineAdapters,
          adapterArgs,
        });

        await waitUntilConfigured();

        expect(
          screen.getByText(`${featureName} is enabled`)
        ).toBeInTheDocument();
      }
    );
  });

  describe('with flag updating', () => {
    describe('with no duplicate flags', () => {
      it('should allow updating the flag of the memory adapter', async () => {
        const store = createStore({
          [STATE_SLICE]: {
            flags: { memory: defaultFlags, localstorage: defaultFlags },
          },
        });
        const { waitUntilConfigured: waitUntilConfiguredFirstRender } = render(
          store,
          <TestComponent adapterIdentifiers={[memoryAdapter.id]} />,
          {
            adapter: combineAdapters,
            adapterArgs,
          }
        );

        await waitUntilConfiguredFirstRender();

        expect(
          screen.queryByText('updatedFlag is enabled')
        ).not.toBeInTheDocument();

        act(() => {
          memoryAdapter.updateFlags({
            updatedMemoryAdapterFlag: true,
          });
        });

        expect(
          screen.getByText('updatedMemoryAdapterFlag is enabled')
        ).toBeInTheDocument();

        act(() => {
          localstorageAdapter.updateFlags({
            updatedLocalstorageAdapterFlag: true,
          });
        });

        expect(
          screen.getByText('updatedLocalstorageAdapterFlag is enabled')
        ).toBeInTheDocument();
      });
    });
    describe('with duplicate flags', () => {
      it('should resolve flag in the order of adapter identifiers', async () => {
        const store = createStore({
          [STATE_SLICE]: {
            flags: { memory: defaultFlags, localstorage: defaultFlags },
          },
        });
        const { waitUntilConfigured: waitUntilConfiguredFirstRender } = render(
          store,
          <TestComponent adapterIdentifiers={[memoryAdapter.id]} />,
          {
            adapter: combineAdapters,
            adapterArgs,
          }
        );

        await waitUntilConfiguredFirstRender();

        expect(
          screen.queryByText('updatedFlag is enabled')
        ).not.toBeInTheDocument();

        act(() => {
          memoryAdapter.updateFlags({
            updatedShared: true,
          });
          localstorageAdapter.updateFlags({
            updatedShared: false,
          });
        });

        expect(
          screen.getByText('updatedShared is enabled')
        ).toBeInTheDocument();

        act(() => {
          memoryAdapter.updateFlags({
            updatedShared: false,
          });
          localstorageAdapter.updateFlags({
            updatedShared: true,
          });
        });

        expect(
          screen.getByText('updatedShared is disabled')
        ).toBeInTheDocument();
      });
    });
  });
});
