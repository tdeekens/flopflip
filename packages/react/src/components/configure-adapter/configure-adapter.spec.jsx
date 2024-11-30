import { getCache } from '@flopflip/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  fireEvent,
  render as rtlRender,
  screen,
  waitFor,
} from '@flopflip/test-utils';
import { adapterIdentifiers, cacheIdentifiers } from '@flopflip/types';
import React, { useContext } from 'react';

import { useAdapterReconfiguration } from '../../hooks/use-adapter-reconfiguration';
import { AdapterContext } from '../adapter-context';
import { AdapterStates, ConfigureAdapter } from './configure-adapter';

const createAdapter = () => ({
  id: adapterIdentifiers.memory,
  getIsConfigurationStatus: vi.fn(() => false),
  configure: vi.fn(() => Promise.resolve()),
  reconfigure: vi.fn(() => Promise.resolve()),
});

const createTestProps = ({ adapter }) => ({
  adapterArgs: {
    clientSideId: 'foo-clientSideId',
    user: {
      key: 'foo-user-key',
    },
  },
  adapterStatus: AdapterStates.CONFIGURED,
  onFlagsStateChange: vi.fn(),
  onStatusStateChange: vi.fn(),
  adapter,
});

function AdapterStatus({ children }) {
  const adapterContext = useContext(AdapterContext);
  const isAdapterStatus = (status) => adapterContext.status === status;

  return (
    <>
      <ul>
        <li>
          Is configuring:{' '}
          {isAdapterStatus(AdapterStates.CONFIGURING) ? 'Yes' : 'No'}
        </li>
        <li>
          Is configured:{' '}
          {isAdapterStatus(AdapterStates.CONFIGURED) ? 'Yes' : 'No'}
        </li>
        <li>
          Is unconfigured:{' '}
          {isAdapterStatus(AdapterStates.UNCONFIGURED) ? 'Yes' : 'No'}
        </li>
      </ul>
      {children}
    </>
  );
}

const render = ({ props, adapter }) => {
  const baseProps = createTestProps({ adapter });
  const mergedProps = { ...baseProps, ...props };

  const { rerender } = rtlRender(<ConfigureAdapter {...mergedProps} />);

  const waitUntilStatus = (status = AdapterStates.CONFIGURED) =>
    screen.findByText(`Is ${status}: Yes`);

  return { waitUntilStatus, rerender, mergedRenderProps: mergedProps };
};

const renderWithReconfiguration = ({ props, adapter }) => {
  const baseProps = createTestProps({ adapter });
  const mergedProps = { ...baseProps, ...props };

  function Reconfiguration() {
    const reconfigure = useAdapterReconfiguration();

    return (
      <button
        type="button"
        onClick={() => {
          reconfigure({
            memory: {
              group: 'reconfigured-user-group',
            },
          });
        }}
      >
        Reconfigure
      </button>
    );
  }

  const { rerender } = rtlRender(
    <ConfigureAdapter {...mergedProps}>
      <AdapterStatus>
        <Reconfiguration />
      </AdapterStatus>
    </ConfigureAdapter>
  );

  const waitUntilStatus = (status = AdapterStates.CONFIGURED) =>
    screen.findByText(`Is ${status}: Yes`);
  const triggerReconfiguration = async () => {
    const reconfigurationButton = await screen.findByRole('button', {
      name: /reconfigure/i,
    });

    fireEvent.click(reconfigurationButton);
  };

  return {
    waitUntilStatus,
    triggerReconfiguration,
    rerender,
    mergedRenderProps: mergedProps,
  };
};

describe('rendering', () => {
  describe('when providing render prop', () => {
    describe('when adapter is configured', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();
        const props = { render: vi.fn(() => <AdapterStatus />) };
        adapter.getIsConfigurationStatus.mockReturnValue(true);

        const { waitUntilStatus } = render({ props, adapter });

        expect(props.render).toHaveBeenCalled();

        await waitUntilStatus();
      });
    });

    describe('when adapter is not configured', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();

        const props = { render: vi.fn(() => <AdapterStatus />) };

        render({ props, adapter });

        expect(props.render).not.toHaveBeenCalled();

        await waitFor(() => {
          expect(adapter.getIsConfigurationStatus).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when providing function as a child', () => {
    describe('when adapter is configured', () => {
      it('should invoke children prop with ready state', async () => {
        const adapter = createAdapter();

        adapter.getIsConfigurationStatus.mockReturnValue(true);

        const props = { children: vi.fn(() => <AdapterStatus />) };

        const { waitUntilStatus } = render({ props, adapter });

        expect(props.children).toHaveBeenCalledWith(
          expect.objectContaining({ isAdapterConfigured: true })
        );

        await waitUntilStatus();
      });
    });
  });

  describe('when providing React node as children', () => {
    describe('when adapter is configured', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();

        adapter.getIsConfigurationStatus.mockReturnValue(true);

        const props = {
          children: <AdapterStatus>Test component</AdapterStatus>,
        };

        const { waitUntilStatus } = render({ props, adapter });

        expect(screen.getByText('Test component')).toBeInTheDocument();

        await waitUntilStatus();
      });
    });

    describe('when adapter is not configured', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();
        const props = {
          children: <AdapterStatus>Test component</AdapterStatus>,
        };

        const { waitUntilStatus } = render({ props, adapter });

        expect(screen.getByText('Test component')).toBeInTheDocument();

        await waitUntilStatus();
      });
    });
  });
});

describe('when adapter configuration should be deferred', () => {
  it('should not configure the adapter', async () => {
    const adapter = createAdapter();

    const props = {
      children: <AdapterStatus />,
      shouldDeferAdapterConfiguration: true,
    };

    const { waitUntilStatus } = render({ props, adapter });

    expect(adapter.configure).not.toHaveBeenCalled();

    await waitUntilStatus();
  });
});

describe('when adapter configuration should not be deferred', () => {
  it('should configure the adapter', async () => {
    const adapter = createAdapter();
    const props = { children: <AdapterStatus /> };

    const { waitUntilStatus, mergedRenderProps } = render({ props, adapter });

    expect(adapter.configure).toHaveBeenCalledWith(
      mergedRenderProps.adapterArgs,
      {
        onFlagsStateChange: mergedRenderProps.onFlagsStateChange,
        onStatusStateChange: mergedRenderProps.onStatusStateChange,
      }
    );

    await waitUntilStatus();
  });
});

describe('when providing default flags', () => {
  describe('without cached flags', () => {
    it('should notify parent about the default flag state', async () => {
      const adapter = createAdapter();
      const defaultFlags = {
        flagName: true,
      };
      const props = { children: <AdapterStatus />, defaultFlags };

      const { waitUntilStatus, mergedRenderProps } = render({ props, adapter });

      expect(mergedRenderProps.onFlagsStateChange).toHaveBeenCalledWith({
        flags: defaultFlags,
      });

      await waitUntilStatus();
    });
  });
  describe('with cached flags', () => {
    const cachedFlags = {
      cachedFlag: true,
    };
    const cacheKey = 'test';
    let cache;

    beforeEach(async () => {
      cache = await getCache(
        cacheIdentifiers.session,
        adapterIdentifiers.memory,
        cacheKey
      );

      cache.set(cachedFlags);
    });

    it('should notify parent about the cached and default flag state', async () => {
      const adapter = createAdapter();
      const defaultFlags = {
        defaultFlag: true,
      };
      const props = {
        children: <AdapterStatus />,
        defaultFlags,
        adapterArgs: {
          cacheIdentifier: cacheIdentifiers.session,
          clientSideId: 'foo-clientSideId',
          user: {
            key: 'foo-user-key',
          },
        },
      };

      const { waitUntilStatus, mergedRenderProps } = render({ props, adapter });

      expect(mergedRenderProps.onFlagsStateChange).toHaveBeenCalledWith({
        flags: {
          ...defaultFlags,
          ...cachedFlags,
        },
      });

      await waitUntilStatus();
    });
  });
});

describe('when adapter args change before adapter was configured', () => {
  it('should configure adapter with merged adapter args', async () => {
    const adapter = createAdapter();
    const props = {
      children: <AdapterStatus />,
      shouldDeferAdapterConfiguration: true,
    };

    const { rerender, waitUntilStatus, mergedRenderProps } = render({
      props,
      adapter,
    });

    const nextAdapterArgs = {
      nextValue: true,
    };

    rerender(
      <ConfigureAdapter
        {...mergedRenderProps}
        shouldDeferAdapterConfiguration={false}
        adapterArgs={nextAdapterArgs}
      >
        <AdapterStatus />
      </ConfigureAdapter>
    );

    expect(adapter.configure).toHaveBeenCalledWith(
      { ...mergedRenderProps.adapterArgs, ...nextAdapterArgs },
      expect.anything()
    );

    await waitUntilStatus();
  });
});

describe('when adapter args change after adapter was configured', () => {
  it('should reconfigure adapter with updated adapter args', async () => {
    const adapter = createAdapter();
    const props = {};

    const { rerender, waitUntilStatus, mergedRenderProps } = render({
      props,
      adapter,
    });

    const nextAdapterArgs = {
      ...mergedRenderProps.adapterArgs,
      nextValue: true,
    };

    rerender(
      <ConfigureAdapter {...mergedRenderProps} adapterArgs={nextAdapterArgs}>
        <AdapterStatus />
      </ConfigureAdapter>
    );

    await waitUntilStatus();

    await waitFor(() => {
      expect(adapter.reconfigure).toHaveBeenCalledWith(
        nextAdapterArgs,
        expect.anything()
      );
    });
  });

  it('should reconfigure adapter when reconfiguration is triggered', async () => {
    const adapter = createAdapter();
    const props = {};

    const { triggerReconfiguration, waitUntilStatus } =
      renderWithReconfiguration({
        props,
        adapter,
      });

    await waitUntilStatus();
    await triggerReconfiguration();

    await waitFor(() => {
      expect(adapter.reconfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          memory: {
            group: 'reconfigured-user-group',
          },
        }),
        expect.anything()
      );
    });

    // The adapter should reconfigure multiple times overwriting
    // prior configurations
    expect(adapter.reconfigure).toHaveBeenCalledTimes(2);
  });
});

describe('when adapter was configured and component updates', () => {
  it('should not configure adapter multiple times', async () => {
    const adapter = createAdapter();
    const props = {
      adapterStatus: AdapterStates.UNCONFIGURED,
    };

    const { rerender, waitUntilStatus, mergedRenderProps } = render({
      props,
      adapter,
    });

    const nextProps = {
      ...mergedRenderProps,
      adapterStatus: AdapterStates.CONFIGURED,
      changedValue: true,
    };

    rerender(
      <ConfigureAdapter {...nextProps}>
        <AdapterStatus />
      </ConfigureAdapter>
    );

    expect(adapter.configure).toHaveBeenCalledTimes(1);

    await waitUntilStatus();
  });
});
