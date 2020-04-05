import { DeepReadonly } from 'ts-essentials';
import React from 'react';
import merge from 'deepmerge';
import {
  TAdapterArgs,
  TAdapterReconfiguration,
  TConfigureAdapterChildren,
  TConfigureAdapterChildrenAsFunction,
} from '@flopflip/types';

const isFunctionChildren = (
  children: TConfigureAdapterChildren
): children is TConfigureAdapterChildrenAsFunction =>
  typeof children === 'function';

const isEmptyChildren = (children: TConfigureAdapterChildren) =>
  !isFunctionChildren(children) && React.Children.count(children) === 0;

const mergeAdapterArgs = (
  previousAdapterArgs: TAdapterArgs,
  {
    adapterArgs: nextAdapterArgs,
    options = {},
  }: DeepReadonly<TAdapterReconfiguration>
): TAdapterArgs =>
  options.shouldOverwrite
    ? nextAdapterArgs
    : merge(previousAdapterArgs, nextAdapterArgs);

export { isFunctionChildren, isEmptyChildren, mergeAdapterArgs };
