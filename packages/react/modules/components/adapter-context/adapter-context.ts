import createReactContext, { Context } from 'create-react-context';
import {
  AdapterContext as AdapterContextType,
  AdapterStatus as AdapterStatusType,
  ReconfigureAdapter as ReconfigureAdapterType,
} from '@flopflip/types';

const initialReconfigureAdapter: ReconfigureAdapterType = (): void => {};
const initialAdapterStatus: AdapterStatusType = {
  isReady: false,
  isConfigured: false,
};
const createAdapterContext = (
  reconfigure?: ReconfigureAdapterType,
  status?: AdapterStatusType
): AdapterContextType => ({
  reconfigure: reconfigure || initialReconfigureAdapter,
  status: status || initialAdapterStatus,
});

const AdapterContext: Context<AdapterContextType> = createReactContext(
  createAdapterContext()
);

export default AdapterContext;
export { createAdapterContext };
