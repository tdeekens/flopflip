import * as React from 'react';

export default function wrapDisplayName(
  BaseComponent: React.ComponentType<any>,
  hocName: string
) {
  const previousDisplayName = BaseComponent.displayName ?? BaseComponent.name;

  return `${hocName}(${previousDisplayName ?? 'Component'})`;
}
