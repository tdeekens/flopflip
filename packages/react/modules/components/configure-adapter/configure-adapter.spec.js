import React from 'react';
import { render as rtlRender } from '@flopflip/test-utils';
import ConfigureAdapter from './configure-adapter';

const createAdapter = () => ({
  getIsReady: jest.fn(() => false),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),
});

const createTestProps = ({ adapter }) => ({
  adapterArgs: {
    clientSideId: 'foo-clientSideId',
    user: {
      key: 'foo-user-key',
    },
  },
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  adapter,
});

const TestComponent = () => <span>Test component</span>;

const render = ({ props, adapter }) => {
  const baseProps = createTestProps({ adapter });
  const mergedProps = { ...baseProps, ...props };

  const rendered = rtlRender(<ConfigureAdapter {...mergedProps} />);
  const waitUntilReady = () => Promise.resolve();

  return { ...rendered, waitUntilReady, props: mergedProps };
};

describe('rendering', () => {
  describe('when providing render prop', () => {
    describe('when adapter is ready', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();
        adapter.getIsReady.mockReturnValue(true);
        const props = { render: jest.fn() };

        const rendered = render({ props, adapter });

        expect(props.render).toHaveBeenCalled();

        await rendered.waitUntilReady();
      });
    });

    describe('when adapter is not ready', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();

        const props = { render: jest.fn() };

        const rendered = render({ props, adapter });

        expect(props.render).not.toHaveBeenCalled();

        await rendered.waitUntilReady();
      });
    });
  });

  describe('when providing function as a child', () => {
    describe('when adapter is ready', () => {
      it('should invoke children prop with ready state', async () => {
        const adapter = createAdapter();

        adapter.getIsReady.mockReturnValue(true);

        const props = { children: jest.fn() };

        const rendered = render({ props, adapter });

        expect(props.children).toHaveBeenCalledWith(
          expect.objectContaining({ isAdapterReady: true })
        );

        await rendered.waitUntilReady();
      });
    });
  });

  describe('when providing React node as children', () => {
    describe('when adapter is ready', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();

        adapter.getIsReady.mockReturnValue(true);

        const props = { children: <TestComponent /> };

        const rendered = render({ props, adapter });

        expect(rendered.queryByText('Test component')).toBeInTheDocument();

        await rendered.waitUntilReady();
      });
    });

    describe('when adapter is not ready', () => {
      it('should invoke render prop', async () => {
        const adapter = createAdapter();
        const props = { children: <TestComponent /> };

        const rendered = render({ props, adapter });

        expect(rendered.queryByText('Test component')).toBeInTheDocument();

        await rendered.waitUntilReady();
      });
    });
  });
});

describe('when adapter configuration should be deferred', () => {
  it('should not configure the adapter', async () => {
    const adapter = createAdapter();

    const props = {
      children: jest.fn(),
      shouldDeferAdapterConfiguration: true,
    };

    const rendered = render({ props, adapter });

    expect(adapter.configure).not.toHaveBeenCalled();

    await rendered.waitUntilReady();
  });
});

describe('when adapter configuration should not be deferred', () => {
  it('should configure the adapter', async () => {
    const adapter = createAdapter();
    const props = { children: <TestComponent /> };

    const rendered = render({ props, adapter });

    expect(adapter.configure).toHaveBeenCalledWith(rendered.props.adapterArgs, {
      onFlagsStateChange: rendered.props.onFlagsStateChange,
      onStatusStateChange: rendered.props.onStatusStateChange,
    });

    await rendered.waitUntilReady();
  });
});

describe('when providing default flags', () => {
  it('should notify parent about the default flag state', async () => {
    const adapter = createAdapter();
    const defaultFlags = {
      flagName: true,
    };
    const props = { children: <TestComponent />, defaultFlags };

    const rendered = render({ props, adapter });

    expect(rendered.props.onFlagsStateChange).toHaveBeenCalledWith(
      defaultFlags
    );

    await rendered.waitUntilReady();
  });
});

describe('when adapter args change before adapter was configured', () => {
  it('should configure adapter with merged adapter args', async () => {
    const adapter = createAdapter();
    const props = {
      children: <TestComponent />,
      shouldDeferAdapterConfiguration: true,
    };

    const rendered = render({
      props,
      adapter,
    });

    const nextAdapterArgs = {
      nextValue: true,
    };

    rendered.rerender(
      <ConfigureAdapter
        {...rendered.props}
        shouldDeferAdapterConfiguration={false}
        adapterArgs={nextAdapterArgs}
      >
        <TestComponent />
      </ConfigureAdapter>
    );
    expect(adapter.configure).toHaveBeenCalledWith(
      { ...rendered.props.adapterArgs, ...nextAdapterArgs },
      expect.anything()
    );

    await rendered.waitUntilReady();
  });
});

describe('when adapter args change after adapter was configured', () => {
  it('should reconfigure adapter with updated adapter args', async () => {
    const adapter = createAdapter();
    const props = {
      children: <TestComponent />,
    };

    const rendered = render({ props, adapter });

    const nextAdapterArgs = {
      ...rendered.props.adapterArgs,
      nextValue: true,
    };

    rendered.rerender(
      <ConfigureAdapter {...rendered.props} adapterArgs={nextAdapterArgs}>
        <TestComponent />
      </ConfigureAdapter>
    );

    await rendered.waitUntilReady();

    expect(adapter.reconfigure).toHaveBeenCalledWith(
      nextAdapterArgs,
      expect.anything()
    );
  });
});

describe('when adapter was configured and component updates', () => {
  it('should not configure adapter multiple times', async () => {
    const adapter = createAdapter();
    const props = {
      children: <TestComponent />,
    };

    const rendered = render({ props, adapter });

    const nextProps = {
      ...rendered.props,
      changedValue: true,
    };

    rendered.rerender(
      <ConfigureAdapter {...nextProps}>
        <TestComponent />
      </ConfigureAdapter>
    );

    expect(adapter.configure).toHaveBeenCalledTimes(1);

    await rendered.waitUntilReady();
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `defaultFlags` to an empty object', () => {
      expect(ConfigureAdapter.defaultProps.defaultFlags).toEqual({});
    });
  });
});
