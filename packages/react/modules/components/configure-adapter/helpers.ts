import React from 'react';
import merge from 'deepmerge';
import {
  AdapterArgs,
  AdapterReconfiguration,
  ConfigureAdapterChildren,
  ConfigureAdapterChildrenAsFunction,
} from '@flopflip/types';

const isFunctionChildren = (
  children: ConfigureAdapterChildren
): children is ConfigureAdapterChildrenAsFunction =>
  typeof children === 'function';

const isEmptyChildren = (children: ConfigureAdapterChildren): boolean =>
  !isFunctionChildren(children) && React.Children.count(children) === 0;

const mergeAdapterArgs = (
  previousAdapterArgs: AdapterArgs,
  { adapterArgs: nextAdapterArgs, options = {} }: AdapterReconfiguration
): AdapterArgs =>
  options.shouldOverwrite
    ? nextAdapterArgs
    : merge(previousAdapterArgs, nextAdapterArgs);

export { isFunctionChildren, isEmptyChildren, mergeAdapterArgs };
