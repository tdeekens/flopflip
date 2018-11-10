// @flow

import { type ComponentType } from 'react';

type ProvidedProps = {};

export default (nextDisplayName: string) => (
  BaseComponent: ComponentType<ProvidedProps>
): ComponentType<ProvidedProps> => {
  BaseComponent['displayName'] = nextDisplayName;

  return BaseComponent;
};
