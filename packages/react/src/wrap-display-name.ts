import type React from 'react';

function wrapDisplayName(
  BaseComponent: React.ComponentType<any>,
  hocName: string,
) {
  const previousDisplayName = BaseComponent.displayName ?? BaseComponent.name;

  return `${hocName}(${previousDisplayName ?? 'Component'})`;
}

export { wrapDisplayName };
