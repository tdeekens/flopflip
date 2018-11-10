// @flow

import { type ComponentType } from 'react';

type ProvidedProps = {};

export default (BaseComponent: ComponentType<any>, hocName: string): string => {
  const previousDisplayName = BaseComponent.displayName || BaseComponent.name;

  return `${hocName}(${previousDisplayName})`;
};
