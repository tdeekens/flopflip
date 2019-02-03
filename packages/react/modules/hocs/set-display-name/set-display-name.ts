import React from 'react';

export default (nextDisplayName: string) => (
  BaseComponent: React.ComponentType<any>
): React.ComponentType<any> => {
  BaseComponent['displayName'] = nextDisplayName;

  return BaseComponent;
};
