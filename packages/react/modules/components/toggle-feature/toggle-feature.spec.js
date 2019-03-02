import React from 'react';
import { render, components } from '@flopflip/test-utils';
import ToggleFeature from './toggle-feature';

describe('when feature disabled', () => {
  describe('with untoggled component', () => {
    const TestComponent = () => (
      <ToggleFeature
        isFeatureEnabled={false}
        untoggledComponent={components.UntoggledComponent}
      >
        <components.ToggledComponent />
      </ToggleFeature>
    );

    it('should render the component representing a disabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });

    it('should not render the component representing am enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });

  describe('without untoggled component', () => {
    const TestComponent = () => (
      <ToggleFeature isFeatureEnabled={false}>
        <components.ToggledComponent />
      </ToggleFeature>
    );

    it('should render neither the component representing an disabled or enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toBeInTheDocument();
    });
  });
});

describe('when feature enabled', () => {
  describe('with `children`', () => {
    describe('being a `node`', () => {
      const TestComponent = () => (
        <ToggleFeature
          isFeatureEnabled
          untoggledComponent={components.UntoggledComponent}
        >
          <components.ToggledComponent />
        </ToggleFeature>
      );

      it('should not render the component representing a disabled feature', () => {
        const { queryByFlagName } = render(<TestComponent />);

        expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });

      it('should render the component representing a enabled feature', () => {
        const { queryByFlagName } = render(<TestComponent />);

        expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });

    describe('being a `function`', () => {
      let props;
      beforeEach(() => {
        props = {
          isFeatureEnabled: true,
          untoggledComponent: components.UntoggledComponent,
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
        untoggledComponent={components.UntoggledComponent}
        toggledComponent={components.ToggledComponent}
      />
    );

    it('should not render the component representing a disabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });

    it('should render the component representing a enabled feature', () => {
      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });

  describe('with `render`', () => {
    let props;
    beforeEach(() => {
      props = {
        isFeatureEnabled: true,
        untoggledComponent: components.UntoggledComponent,
        render: jest.fn(() => <components.ToggledComponent />),
      };
    });

    it('should invoke `render`', () => {
      render(<ToggleFeature {...props} />);

      expect(props.render).toHaveBeenCalled();
    });

    it('should render the component representing a enabled feature', () => {
      const { queryByFlagName } = render(<ToggleFeature {...props} />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});

describe('statics', () => {
  it('should have a `diplayName`', () => {
    expect(ToggleFeature.displayName).toEqual('ToggleFeature');
  });
});
