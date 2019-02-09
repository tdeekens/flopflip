import createReactContext, { Context } from 'create-react-context';
import { ReconfigureAdapter } from '@flopflip/types';

const initialReconfigureAdapter: ReconfigureAdapter = (): void => {};

const AdapterContext: Context<ReconfigureAdapter> = createReactContext(
  initialReconfigureAdapter
);

export default AdapterContext;
