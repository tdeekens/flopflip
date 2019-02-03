// @flow

import React from 'react';

export default (BaseComponent: React.ComponentType<any>, hocName: string): string => {
  const previousDisplayName = BaseComponent.displayName || BaseComponent.name;

  return `${hocName}(${previousDisplayName || 'Component'})`;
};
