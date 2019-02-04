import React from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';
import omit from 'lodash.omit';

type RequiredProps = {};
type Omit<Props, PropsToOmit> = Pick<Props, Exclude<keyof Props, PropsToOmit>>;

const omitProps = <Props extends RequiredProps, PropsToOmit>(
  propsToOmit: PropsToOmit
): ((
  BaseComponent: React.ComponentType<Props>
) => React.ComponentType<Omit<Props, PropsToOmit>>) => BaseComponent => {
  const OmitProps = (
    props: Props
  ): React.ComponentType<Omit<Props, PropsToOmit>> =>
    React.createElement(BaseComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'omitProps'))(
      OmitProps
    );
  }

  return OmitProps;
};

export default omitProps;
