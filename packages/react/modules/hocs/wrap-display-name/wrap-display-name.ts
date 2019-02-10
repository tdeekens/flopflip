import React from 'react';

export default <Props extends object>(
  BaseComponent: React.ComponentType<Props>,
  hocName: string
): string => {
  const previousDisplayName = BaseComponent.displayName || BaseComponent.name;

  return `${hocName}(${previousDisplayName || 'Component'})`;
};
