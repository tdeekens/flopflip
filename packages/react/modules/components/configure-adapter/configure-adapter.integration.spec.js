import React from 'react';
import { render } from '@flopflip/test-utils';
import ConfigureAdapter from './configure-adapter';

const ChildComponent = () => <div>Child component</div>;
ChildComponent.displayName = 'ChildComponent';

const createAdapter = () => ({
  getIsReady: jest.fn(() => false),
  configure: jest.fn(() => Promise.resolve()),
  reconfigure: jest.fn(() => Promise.resolve()),
});

const createProps = ({ adapter }) => ({
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

describe('rendering', () => {
  describe('when providing render prop', () => {
    describe('when adapter is ready', () => {
      it('should invoke render prop', () => {
        const adapter = createAdapter();
        const props = createProps({ adapter });

        adapter.getIsReady.mockReturnValue(true);
        const renderProp = jest.fn();

        render(<ConfigureAdapter {...props} render={renderProp} />);

        expect(renderProp).toHaveBeenCalled();
      });
    });

    describe('when adapter is not ready', () => {
      it('should invoke render prop', () => {
        const adapter = createAdapter();
        const props = createProps({ adapter });

        const renderProp = jest.fn();

        render(<ConfigureAdapter {...props} render={renderProp} />);

        expect(renderProp).not.toHaveBeenCalled();
      });
    });
  });

  describe('when providing function as a child', () => {
    describe('when adapter is ready', () => {
      it('should invoke children prop with ready state', () => {
        const adapter = createAdapter();
        const props = createProps({ adapter });

        adapter.getIsReady.mockReturnValue(true);
        const childrenProp = jest.fn();

        render(<ConfigureAdapter {...props}>{childrenProp}</ConfigureAdapter>);

        expect(childrenProp).toHaveBeenCalledWith(
          expect.objectContaining({ isAdapterReady: true })
        );
      });
    });
  });

  describe('when providing React node as children', () => {
    describe('when adapter is ready', () => {
      it('should invoke render prop', () => {
        const adapter = createAdapter();
        const props = createProps({ adapter });

        adapter.getIsReady.mockReturnValue(true);

        const rendered = render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(rendered.queryByText('Child component')).toBeInTheDocument();
      });
    });

    describe('when adapter is not ready', () => {
      it('should invoke render prop', () => {
        const adapter = createAdapter();
        const props = createProps({ adapter });

        const rendered = render(
          <ConfigureAdapter {...props}>
            <ChildComponent />
          </ConfigureAdapter>
        );

        expect(rendered.queryByText('Child component')).toBeInTheDocument();
      });
    });
  });
});

describe('when adapter configuration should be deferred', () => {
  it('should not configure the adapter', () => {
    const adapter = createAdapter();
    const props = createProps({ adapter });

    const childrenProp = jest.fn();

    render(
      <ConfigureAdapter {...props} shouldDeferAdapterConfiguration>
        {childrenProp}
      </ConfigureAdapter>
    );

    expect(adapter.configure).not.toHaveBeenCalled();
  });
});

describe('when adapter configuration should not be deferred', () => {
  it('should configure the adapter', () => {
    const adapter = createAdapter();
    const props = createProps({ adapter });

    render(
      <ConfigureAdapter {...props}>
        <ChildComponent />
      </ConfigureAdapter>
    );

    expect(adapter.configure).toHaveBeenCalledWith(props.adapterArgs, {
      onFlagsStateChange: props.onFlagsStateChange,
      onStatusStateChange: props.onStatusStateChange,
    });
  });
});

describe('when providing default flags', () => {
  it('should notify parent about the default flag state', () => {
    const adapter = createAdapter();
    const defaultFlags = {
      flagName: true,
    };
    const props = createProps({ adapter });

    render(
      <ConfigureAdapter {...props} defaultFlags={defaultFlags}>
        <ChildComponent />
      </ConfigureAdapter>
    );

    expect(props.onFlagsStateChange).toHaveBeenCalledWith(defaultFlags);
  });
});

describe('when adapter args change before adapter was configured', () => {
  const adapter = createAdapter();
  const props = createProps({ adapter });

  const rendered = render(
    <ConfigureAdapter {...props} shouldDeferAdapterConfiguration>
      <ChildComponent />
    </ConfigureAdapter>
  );

  const nextAdapterArgs = {
    nextValue: true,
  };

  rendered.rerender(
    <ConfigureAdapter {...props} adapterArgs={nextAdapterArgs}>
      <ChildComponent />
    </ConfigureAdapter>
  );

  it('should configure adapter with merged adapter args', () => {
    expect(adapter.configure).toHaveBeenCalledWith(
      { ...props.adapterArgs, ...nextAdapterArgs },
      expect.anything()
    );
  });
});

describe('when adapter args change after adapter was configured', () => {
  const adapter = createAdapter();
  const props = createProps({ adapter });

  const rendered = render(
    <ConfigureAdapter {...props}>
      <ChildComponent />
    </ConfigureAdapter>
  );

  const nextAdapterArgs = {
    ...props.adapterArgs,
    nextValue: true,
  };

  rendered.rerender(
    <ConfigureAdapter {...props} adapterArgs={nextAdapterArgs}>
      <ChildComponent />
    </ConfigureAdapter>
  );

  it('should reconfigure adapter with updated adapter args', () => {
    expect(adapter.reconfigure).toHaveBeenCalledWith(
      nextAdapterArgs,
      expect.anything()
    );
  });
});

describe('when adapter was configured and component updates', () => {
  const adapter = createAdapter();
  const props = createProps({ adapter });

  const rendered = render(
    <ConfigureAdapter {...props}>
      <ChildComponent />
    </ConfigureAdapter>
  );

  const nextProps = {
    ...props,
    changedValue: true,
  };

  rendered.rerender(
    <ConfigureAdapter {...nextProps}>
      <ChildComponent />
    </ConfigureAdapter>
  );

  it('should not configure adapter multiple times', () => {
    expect(adapter.configure).toHaveBeenCalledTimes(1);
  });
});
