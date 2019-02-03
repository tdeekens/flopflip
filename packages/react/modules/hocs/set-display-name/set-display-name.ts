import React from 'react';

type RequiredProps = {};

export default <P extends RequiredProps>(nextDisplayName: string) => (
  BaseComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  BaseComponent['displayName'] = nextDisplayName;

  return BaseComponent;
};
