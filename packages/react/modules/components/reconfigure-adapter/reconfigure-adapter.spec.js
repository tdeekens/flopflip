import React from 'react';
import { getComponentInstance, render } from '@flopflip/test-utils';
import { ReconfigureAdapter } from './reconfigure-adapter';

const ChildComponent = () => <div>Child component</div>;
ChildComponent.displayName = 'ChildComponent';

const createTestProps = props => ({
  user: {
    key: 'foo-user-key',
  },
  shouldOverwrite: false,
  reconfigure: jest.fn(),
  children: ChildComponent,

  ...props,
});

describe('rendering', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
  });

  it('should render `children`', () => {
    const rendered = render(
      <ReconfigureAdapter {...props}>
        <ChildComponent />
      </ReconfigureAdapter>
    );

    expect(rendered.queryByText('Child component')).toBeInTheDocument();
  });
});

describe('lifecycle', () => {
  let props;
  let componentInstance;

  describe('componentDidMount', () => {
    beforeEach(() => {
      props = createTestProps();
      componentInstance = getComponentInstance(
        <ReconfigureAdapter {...props}>
          <ChildComponent />
        </ReconfigureAdapter>
      );

      componentInstance.componentDidMount();
    });

    it('should invoke `reconfigure`', () => {
      expect(props.reconfigure).toHaveBeenCalled();
    });

    it('should invoke `reconfigure` with `user`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          user: props.user,
        }),
        expect.any(Object)
      );
    });

    it('should invoke `reconfigure` with `shouldOverwrite`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          shouldOverwrite: props.shouldOverwrite,
        })
      );
    });
  });
  describe('componentDidUpdate', () => {
    beforeEach(() => {
      props = createTestProps();
      componentInstance = getComponentInstance(
        <ReconfigureAdapter {...props}>
          <ChildComponent />
        </ReconfigureAdapter>
      );

      props.reconfigure.mockClear();

      componentInstance.componentDidUpdate();
    });

    it('should invoke `reconfigure`', () => {
      expect(props.reconfigure).toHaveBeenCalled();
    });

    it('should invoke `reconfigure` with `user`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          user: props.user,
        }),
        expect.any(Object)
      );
    });

    it('should invoke `reconfigure` with `shouldOverwrite`', () => {
      expect(props.reconfigure).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          shouldOverwrite: props.shouldOverwrite,
        })
      );
    });
  });
});

describe('statics', () => {
  describe('defaultProps', () => {
    it('should default `shouldOverwrite` to `false`', () => {
      expect(ReconfigureAdapter.defaultProps.shouldOverwrite).toBe(false);
    });

    it('should default `children` to `null`', () => {
      expect(ReconfigureAdapter.defaultProps.children).toBe(null);
    });
  });
});
