import {
  TAdapterArgs,
  TAdapterReconfiguration,
  TConfigureAdapterChildren,
  TConfigureAdapterChildrenAsFunction,
} from '@flopflip/types';
import { Children } from 'react';
import merge from 'ts-deepmerge';

const isFunctionChildren = (
  children: TConfigureAdapterChildren
): children is TConfigureAdapterChildrenAsFunction =>
  typeof children === 'function';

const isEmptyChildren = (children: TConfigureAdapterChildren) =>
  !isFunctionChildren(children) && Children.count(children) === 0;

const mergeAdapterArgs = (
  previousAdapterArgs: TAdapterArgs,
  { adapterArgs: nextAdapterArgs, options = {} }: TAdapterReconfiguration
): TAdapterArgs =>
  options.shouldOverwrite
    ? nextAdapterArgs
    : merge(previousAdapterArgs, nextAdapterArgs);

export { isEmptyChildren, isFunctionChildren, mergeAdapterArgs };
