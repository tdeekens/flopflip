import * as React from 'react';

export default <T extends React.ComponentType<any>>(
  nextDisplayName: string
) => (BaseComponent: T): T => {
  BaseComponent.displayName = nextDisplayName;

  return BaseComponent;
};
