// @flow

import createReactContext, { Context } from 'create-react-context';
import { ReconfigureAdapter } from '@flopflip/types';

const AdapterContext: Context<ReconfigureAdapter> = createReactContext(
  () => {}
);

export default AdapterContext;
