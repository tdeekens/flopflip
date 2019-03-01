import React from 'react';
import { render } from '@flopflip/test-utils';
import ToggleFeature from './toggle-feature';

const UntoggledComponent = () => <>Feature is untoggled</>;
UntoggledComponent.displayName = 'UntoggledComponent';
const ToggledComponent = () => <>Feature is toggled</>;
ToggledComponent.displayName = 'ToggledComponent';
const FeatureComponent = () => <>Feature is enabled</>;
FeatureComponent.displayName = 'FeatureComponent';

describe('when feature disabled', () => {
  describe('with untoggled component', () => {
    const TestComponent = () => (
      <ToggleFeature
        isFeatureEnabled={false}
        untoggledComponent={UntoggledComponent}
      >
        <FeatureComponent />
      </ToggleFeature>
    );

    it('should render the `UntoggledComponent`', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is untoggled')).toBeInTheDocument();
    });

    it('should not render the `FeatureComponent`', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
    });
  });

  describe('without untoggled component', () => {
    const TestComponent = () => (
      <ToggleFeature isFeatureEnabled={false}>
        <FeatureComponent />
      </ToggleFeature>
    );

    it('should not render the `FeatureComponent`', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is enabled')).not.toBeInTheDocument();
    });
  });
});

describe('when feature enabled', () => {
  describe('with `children`', () => {
    describe('being a `node`', () => {
      const TestComponent = () => (
        <ToggleFeature isFeatureEnabled untoggledComponent={UntoggledComponent}>
          <FeatureComponent />
        </ToggleFeature>
      );

      it('should not render the `UntoggledComponent`', () => {
        const { queryByText } = render(<TestComponent />);

        expect(queryByText('Feature is untoggled')).not.toBeInTheDocument();
      });

      it('should render the `FeatureComponent`', () => {
        const { queryByText } = render(<TestComponent />);

        expect(queryByText('Feature is enabled')).toBeInTheDocument();
      });
    });

    describe('being a `function`', () => {
      let props;
      beforeEach(() => {
        props = {
          isFeatureEnabled: true,
          untoggledComponent: UntoggledComponent,
          children: jest.fn(() => <div>FeatureComponent</div>),
        };
      });

      it('should invoke `children`', () => {
        render(<ToggleFeature {...props} />);

        expect(props.children).toHaveBeenCalled();
      });

      it('should invoke `children` with `isFeatureEnabled`', () => {
        render(<ToggleFeature {...props} />);

        expect(props.children).toHaveBeenCalledWith({
          isFeatureEnabled: props.isFeatureEnabled,
        });
      });
    });
  });

  describe('with `toggledComponent`', () => {
    const TestComponent = () => (
      <ToggleFeature
        isFeatureEnabled
        untoggledComponent={UntoggledComponent}
        toggledComponent={FeatureComponent}
      />
    );

    it('should not render the `UntoggledComponent`', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is untoggled')).not.toBeInTheDocument();
    });

    it('should render the `FeatureComponent`', () => {
      const { queryByText } = render(<TestComponent />);

      expect(queryByText('Feature is enabled')).toBeInTheDocument();
    });
  });

  describe('with `render`', () => {
    let props;
    beforeEach(() => {
      props = {
        isFeatureEnabled: true,
        untoggledComponent: UntoggledComponent,
        render: jest.fn(() => <FeatureComponent />),
      };
    });

    it('should invoke `render`', () => {
      render(<ToggleFeature {...props} />);

      expect(props.render).toHaveBeenCalled();
    });

    it('should `render` the `FeatureComponent`', () => {
      const { queryByText } = render(<ToggleFeature {...props} />);

      expect(queryByText('Feature is enabled')).toBeInTheDocument();
    });
  });
});

describe('statics', () => {
  it('should have a `diplayName`', () => {
    expect(ToggleFeature.displayName).toEqual('ToggleFeature');
  });
});
