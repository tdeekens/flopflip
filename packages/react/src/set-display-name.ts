import type React from 'react';

const setDisplayName =
  <T extends React.ComponentType<any>>(nextDisplayName: string) =>
  (BaseComponent: T): T => {
    BaseComponent.displayName = nextDisplayName;

    return BaseComponent;
  };

export { setDisplayName };
