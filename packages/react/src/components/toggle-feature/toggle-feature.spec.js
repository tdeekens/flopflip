import { components, render } from '@flopflip/test-utils';
import React from 'react';

import ToggleFeature from './toggle-feature';

describe('when feature disabled', () => {
  describe('with untoggled component', () => {
    it('should render the component representing a disabled feature', () => {
      function TestComponent() {
        return (
          <ToggleFeature
            isFeatureEnabled={false}
            untoggledComponent={components.UntoggledComponent}
          >
            <components.ToggledComponent />
          </ToggleFeature>
        );
      }

      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });

    it('should not render the component representing am enabled feature', () => {
      function TestComponent() {
        return (
          <ToggleFeature
            isFeatureEnabled={false}
            untoggledComponent={components.UntoggledComponent}
          >
            <components.ToggledComponent />
          </ToggleFeature>
        );
      }

      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });

  describe('without untoggled component', () => {
    it('should render neither the component representing an disabled or enabled feature', () => {
      function TestComponent() {
        return (
          <ToggleFeature isFeatureEnabled={false}>
            <components.ToggledComponent />
          </ToggleFeature>
        );
      }

      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toBeInTheDocument();
    });
  });
});

describe('when feature enabled', () => {
  describe('with `children`', () => {
    describe('being a `node`', () => {
      it('should not render the component representing a disabled feature', () => {
        function TestComponent() {
          return (
            <ToggleFeature
              isFeatureEnabled
              untoggledComponent={components.UntoggledComponent}
            >
              <components.ToggledComponent />
            </ToggleFeature>
          );
        }

        const { queryByFlagName } = render(<TestComponent />);

        expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
          'data-flag-status',
          'disabled'
        );
      });

      it('should render the component representing a enabled feature', () => {
        function TestComponent() {
          return (
            <ToggleFeature
              isFeatureEnabled
              untoggledComponent={components.UntoggledComponent}
            >
              <components.ToggledComponent />
            </ToggleFeature>
          );
        }

        const { queryByFlagName } = render(<TestComponent />);

        expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
          'data-flag-status',
          'enabled'
        );
      });
    });

    describe('being a `function`', () => {
      it('should invoke `children`', () => {
        const props = {
          isFeatureEnabled: true,
          untoggledComponent: components.UntoggledComponent,
          children: jest.fn(() => <div>FeatureComponent</div>),
        };

        render(<ToggleFeature {...props} />);

        expect(props.children).toHaveBeenCalled();
      });

      it('should invoke `children` with `isFeatureEnabled`', () => {
        const props = {
          isFeatureEnabled: true,
          untoggledComponent: components.UntoggledComponent,
          children: jest.fn(() => <div>FeatureComponent</div>),
        };

        render(<ToggleFeature {...props} />);

        expect(props.children).toHaveBeenCalledWith({
          isFeatureEnabled: props.isFeatureEnabled,
        });
      });
    });
  });

  describe('with `toggledComponent`', () => {
    it('should not render the component representing a disabled feature', () => {
      function TestComponent() {
        return (
          <ToggleFeature
            isFeatureEnabled
            untoggledComponent={components.UntoggledComponent}
            toggledComponent={components.ToggledComponent}
          />
        );
      }

      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });

    it('should render the component representing a enabled feature', () => {
      function TestComponent() {
        return (
          <ToggleFeature
            isFeatureEnabled
            untoggledComponent={components.UntoggledComponent}
            toggledComponent={components.ToggledComponent}
          />
        );
      }

      const { queryByFlagName } = render(<TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });

  describe('with `render`', () => {
    it('should invoke `render`', () => {
      const props = {
        isFeatureEnabled: true,
        untoggledComponent: components.UntoggledComponent,
        render: jest.fn(() => <components.ToggledComponent />),
      };

      render(<ToggleFeature {...props} />);

      expect(props.render).toHaveBeenCalled();
    });

    it('should render the component representing a enabled feature', () => {
      const props = {
        isFeatureEnabled: true,
        untoggledComponent: components.UntoggledComponent,
        render: jest.fn(() => <components.ToggledComponent />),
      };

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
