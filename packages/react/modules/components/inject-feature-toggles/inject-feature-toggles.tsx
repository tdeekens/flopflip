import { FlagName, Flags } from '@flopflip/types';
import flowRight from 'lodash/flowRight';
import React from 'react';
import { defaultAreOwnPropsEqual, filterFeatureToggles } from './utils';
import { withProps, omitProps } from '../../hocs';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';

type InjectedProps = {
  [propKey: string]: Flags;
};

const injectFeatureToggles = <Props extends object>(
  flagNames: Array<FlagName>,
  propKey: string = DEFAULT_FLAGS_PROP_KEY,
  areOwnPropsEqual: (
    nextOwnProps: Props,
    ownProps: Props,
    propKey: string
  ) => boolean = defaultAreOwnPropsEqual
) => (
  Component: React.ComponentType<Props>
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    withProps((props: Props) => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS_PROP_KEY], flagNames),
    })),
    omitProps([ALL_FLAGS_PROP_KEY]),
    (BaseComponent: React.ComponentType<any>) =>
      class ShouldUpdate extends React.Component<{}> {
        static displayName = BaseComponent.displayName;

        shouldComponentUpdate(nextProps: Props) {
          return typeof areOwnPropsEqual === 'function'
            ? !areOwnPropsEqual(this.props as Props, nextProps, propKey)
            : true;
        }

        render(): React.ReactNode {
          return <BaseComponent {...this.props} />;
        }
      }
  )(Component);

export default injectFeatureToggles;
