import React from 'react';
import { render, fireEvent } from '@flopflip/test-utils';
import { AdapterStates } from './../configure-adapter';
import AdapterContext, { createAdapterContext } from './../adapter-context';
import ReconfigureAdapter from './reconfigure-adapter';

const TestComponent = props => {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);

  return (
    <AdapterContext.Provider value={props.adapterContext}>
      <ReconfigureAdapter
        user={props.reconfiguration.user}
        shouldOverwrite={props.reconfiguration.shouldOverwrite}
      >
        <>
          <button type="button" onClick={increment}>
            Increment
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

    expect(rendered.queryByText('Children')).toBeInTheDocument();
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
        user: reconfiguration.user,
      },
      {
        shouldOverwrite: reconfiguration.shouldOverwrite,
      }
    );
  });
});

describe('when updated', () => {
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

    fireEvent.click(rendered.queryByText('Increment'));

    expect(adapterContext.reconfigure).toHaveBeenNthCalledWith(
      2,
      {
        user: reconfiguration.user,
      },
      {
        shouldOverwrite: reconfiguration.shouldOverwrite,
      }
    );
  });
});
