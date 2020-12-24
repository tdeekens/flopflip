import React, { useState, useMemo } from 'react';
import { render, fireEvent } from '@flopflip/test-utils';
import { AdapterStates } from './../configure-adapter';
import AdapterContext, { createAdapterContext } from './../adapter-context';
import ReconfigureAdapter from './reconfigure-adapter';

const TestComponent = (props) => {
  const [count, setCount] = useState(0);
  const [, setState] = useState(0);
  const increment = () => setCount(count + 1);

  const user = useMemo(
    () => ({
      ...props.reconfiguration.user,
      count,
    }),
    [count, props.reconfiguration.user]
  );

  return (
    <AdapterContext.Provider value={props.adapterContext}>
      <ReconfigureAdapter
        user={user}
        shouldOverwrite={props.reconfiguration.shouldOverwrite}
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
};

const createReconfiguration = () => ({
  user: {
    id: 'test-user-id',
  },
  shouldOverwrite: true,
});

describe('with children', () => {
  it('should render children', () => {
    const adapterContext = createAdapterContext(
      jest.fn(),
      AdapterStates.UNCONFIGURED
    );
    const reconfiguration = createReconfiguration();
    const rendered = render(
      <TestComponent
        adapterContext={adapterContext}
        reconfiguration={reconfiguration}
      />
    );

    expect(rendered.getByText('Children')).toBeInTheDocument();
  });
});

describe('when mounted', () => {
  it('should reconfigure with user and configuration', () => {
    const adapterContext = createAdapterContext(
      jest.fn(),
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
        jest.fn(),
        AdapterStates.UNCONFIGURED
      );
      const reconfiguration = createReconfiguration();

      const rendered = render(
        <TestComponent
          adapterContext={adapterContext}
          reconfiguration={reconfiguration}
        />
      );

      fireEvent.click(rendered.queryByText(/Reconfigure without changes/i));

      expect(adapterContext.reconfigure).toHaveBeenCalledTimes(1);
    });
  });

  describe('with reconfiguration change', () => {
    it('should reconfigure again with user and configuration', () => {
      const adapterContext = createAdapterContext(
        jest.fn(),
        AdapterStates.UNCONFIGURED
      );
      const reconfiguration = createReconfiguration();

      const rendered = render(
        <TestComponent
          adapterContext={adapterContext}
          reconfiguration={reconfiguration}
        />
      );

      fireEvent.click(rendered.queryByText(/Reconfigure with changes/i));

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
