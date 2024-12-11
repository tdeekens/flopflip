import { fireEvent, render, screen } from '@flopflip/test-utils';
import { describe, expect, it, vi } from 'vitest';

import React, { useMemo, useState } from 'react';

import { AdapterContext, createAdapterContext } from '../src/adapter-context';
import { AdapterStates } from '../src/configure-adapter';
import { ReconfigureAdapter } from '../src/reconfigure-adapter';

function TestComponent({ reconfiguration, adapterContext }) {
  const [count, setCount] = useState(0);
  const [, setState] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  const user = useMemo(
    () => ({
      ...reconfiguration.user,
      count,
    }),
    [count, reconfiguration.user]
  );

  return (
    <AdapterContext.Provider value={adapterContext}>
      <ReconfigureAdapter
        user={user}
        shouldOverwrite={reconfiguration.shouldOverwrite}
      >
        <>
          <button type="button" onClick={increment}>
            Reconfigure with changes
          </button>
          <button type="button" onClick={setState}>
            Reconfigure without changes
          </button>
          <p>Count is: {count}</p>
          <p>Children</p>
        </>
      </ReconfigureAdapter>
    </AdapterContext.Provider>
  );
}

const createReconfiguration = () => ({
  user: {
    id: 'test-user-id',
  },
  shouldOverwrite: true,
});

describe('with children', () => {
  it('should render children', () => {
    const adapterContext = createAdapterContext(
      ['memory'],
      vi.fn(),
      AdapterStates.UNCONFIGURED
    );
    const reconfiguration = createReconfiguration();
    render(
      <TestComponent
        adapterContext={adapterContext}
        reconfiguration={reconfiguration}
      />
    );

    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});

describe('when mounted', () => {
  it('should reconfigure with user and configuration', () => {
    const adapterContext = createAdapterContext(
      ['memory'],
      vi.fn(),
      AdapterStates.UNCONFIGURED
    );
    const reconfiguration = createReconfiguration();

    render(
      <TestComponent
        adapterContext={adapterContext}
        reconfiguration={reconfiguration}
      />
    );

    expect(adapterContext.reconfigure).toHaveBeenCalledWith(
      {
        user: expect.objectContaining(reconfiguration.user),
      },
      {
        shouldOverwrite: reconfiguration.shouldOverwrite,
      }
    );
  });
});

describe('when updated', () => {
  describe('without reconfiguration change', () => {
    it('should not reconfigure again with user and configuration', () => {
      const adapterContext = createAdapterContext(
        ['memory'],
        vi.fn(),
        AdapterStates.UNCONFIGURED
      );
      const reconfiguration = createReconfiguration();

      render(
        <TestComponent
          adapterContext={adapterContext}
          reconfiguration={reconfiguration}
        />
      );

      fireEvent.click(screen.queryByText(/Reconfigure without changes/i));

      expect(adapterContext.reconfigure).toHaveBeenCalledTimes(1);
    });
  });

  describe('with reconfiguration change', () => {
    it('should reconfigure again with user and configuration', () => {
      const adapterContext = createAdapterContext(
        ['memory'],
        vi.fn(),
        AdapterStates.UNCONFIGURED
      );
      const reconfiguration = createReconfiguration();

      render(
        <TestComponent
          adapterContext={adapterContext}
          reconfiguration={reconfiguration}
        />
      );

      fireEvent.click(screen.queryByText(/Reconfigure with changes/i));

      expect(adapterContext.reconfigure).toHaveBeenNthCalledWith(
        2,
        {
          user: expect.objectContaining(reconfiguration.user),
        },
        {
          shouldOverwrite: reconfiguration.shouldOverwrite,
        }
      );
    });
  });
});
