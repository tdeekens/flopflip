// @flow

import createReactContext, { type Context } from 'create-react-context';
import type { AdapterArgs, ReconfigureAdapter } from '@flopflip/types';

const AdapterContext: Context<ReconfigureAdapter> = createReactContext(
  () => {}
);

export default AdapterContext;
