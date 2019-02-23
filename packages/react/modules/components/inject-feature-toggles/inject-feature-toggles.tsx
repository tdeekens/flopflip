import { FlagName, Flags } from '@flopflip/types';
import flowRight from 'lodash/flowRight';
import React from 'react';
import { defaultAreOwnPropsEqual, filterFeatureToggles } from './utils';
import { withProps, omitProps } from '../../hocs';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';

type InjectedProps = {
  [propKey: string]: Flags;
};
type AreOwnPropsEqual<Props> = (
  props: Props,
  nextProps: Props,
  propKey: string
) => boolean;

const shouldUpdate = <Props extends object>(
  areOwnPropsEqual: AreOwnPropsEqual<Props>,
  propKey: string
) => (Component: React.ComponentType<any>) =>
  class ShouldUpdate extends React.Component<any> {
    static displayName = Component.displayName;

    shouldComponentUpdate(nextProps: Props) {
      return typeof areOwnPropsEqual === 'function'
        ? !areOwnPropsEqual(this.props as Props, nextProps, propKey)
        : true;
    }

    render(): React.ReactNode {
      return <Component {...this.props} />;
    }
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
  Component: React.ComponentType<any>
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    withProps<Props, InjectedProps>((props: Props) => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS_PROP_KEY], flagNames),
    })),
    omitProps<Props>([ALL_FLAGS_PROP_KEY]),
    shouldUpdate<Props>(areOwnPropsEqual, propKey)
  )(Component);

export default injectFeatureToggles;
